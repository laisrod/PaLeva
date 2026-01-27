module Api
  module V1
    class OrdersController < ApplicationController
      include AuthenticableApi
      include ApiEstablishmentScoped

      before_action :authenticate_api_user!
      before_action :set_order, only: [:show, :update, :destroy, :prepare_order, :cancel, :ready_order, :confirm, :deliver]
      skip_before_action :verify_authenticity_token

      def create
        order_data = order_params
        @order = @establishment.orders.new(order_data)
        @order.status = 'draft'

        if @order.save
          render json: {
            order: {
              id: @order.id,
              code: @order.code,
              status: @order.status,
              total_price: @order.total_price.to_f,
              customer_name: @order.customer_name
            },
            message: 'Pedido criado com sucesso'
          }, status: :created
        else
          render json: {
            status: :unprocessable_entity,
            error: @order.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def index
        @orders = @establishment.orders.recent
        @orders = @orders.with_status(params[:status]) if params[:status].present?

        render json: @orders.map { |order|
          # Recalcular total_price se necessário
          begin
            if order.total_price.nil? || order.total_price.zero?
              order.update_total_price
              order.save if order.changed?
            end
          rescue => e
            Rails.logger.error "Erro ao calcular total_price para pedido #{order.id}: #{e.message}"
            # Continua mesmo se houver erro no cálculo
          end
          
          {
            id: order.id,
            code: order.code,
            status: order.status,
            total_price: (order.total_price || 0).to_f,
            customer_name: order.customer_name,
            customer_email: order.customer_email,
            customer_phone: order.customer_phone,
            customer_cpf: order.customer_cpf,
            created_at: order.created_at,
            updated_at: order.updated_at,
            establishment_id: order.establishment_id
          }
        }
      end

      def show
        Rails.logger.info "[Orders#show] GET order code=#{params[:code]} order_id=#{@order.id} items_count=#{@order.order_menu_items.size}"

        # Recalcular total_price se necessário
        if @order.total_price.nil? || @order.total_price.zero?
          @order.update_total_price
          @order.save if @order.changed?
        end

        # Usar associação já eager-loaded por set_order; ordenar por id em memória (JSON estável)
        items = @order.order_menu_items.to_a.sort_by(&:id)

        order_data = {
          id: @order.id,
          code: @order.code,
          status: @order.status,
          total_price: @order.total_price.to_f,
          customer_name: @order.customer_name,
          customer_email: @order.customer_email,
          customer_phone: @order.customer_phone,
          customer_cpf: @order.customer_cpf,
          created_at: @order.created_at,
          updated_at: @order.updated_at,
          establishment_id: @order.establishment_id,
          cancellation_reason: @order.cancellation_reason,
          order_menu_items: items.map { |item|
            menu_item_name = nil
            menu_item_description = nil
            
            if item.menu_item
              if item.menu_item.dish
                menu_item_name = item.menu_item.dish.name
                menu_item_description = item.menu_item.dish.description
              elsif item.menu_item.drink
                menu_item_name = item.menu_item.drink.name
                menu_item_description = item.menu_item.drink.description
              end
            end
            
            {
              id: item.id,
              quantity: item.quantity,
              menu_item_id: item.menu_item_id,
              portion_id: item.portion_id,
              menu_item: item.menu_item ? {
                id: item.menu_item.id,
                name: menu_item_name,
                description: menu_item_description
              } : nil,
              portion: item.portion ? {
                id: item.portion.id,
                description: item.portion.description,
                price: item.portion.price.to_f
              } : nil
            }
          }
        }
        
        render json: order_data
      end

      def update
        if @order.update(order_params)
          render json: @order.reload
        else
          render json: { error: @order.errors.full_messages.join(', ') }, status: :unprocessable_entity
        end
      rescue => e
        Rails.logger.error "Erro ao atualizar pedido: #{e.message}\n#{e.backtrace.join("\n")}"
        render json: { error: "Erro ao atualizar pedido: #{e.message}" }, status: :internal_server_error
      end

      def prepare_order
        service = OrderStatusService.new(@order)
        result = service.progress!

        if result[:success] && result[:status] == 'preparing'
          render json: @order.reload
        else
          render json: { error: result[:message] }, status: :unprocessable_entity
        end
      end

      def ready_order
        if @order.status == 'preparing' && @order.update(status: 'ready')
          @order.update_total_price
          render json: @order
        else
          render json: { error: 'Não foi possível atualizar o status' }, status: :unprocessable_entity
        end
      end

      def confirm
        unless @order.status == 'draft'
          render json: { error: 'Apenas pedidos em rascunho podem ser confirmados' }, status: :unprocessable_entity
          return
        end

        # Verificar se tem email ou telefone antes de tentar atualizar
        if @order.customer_email.blank? && @order.customer_phone.blank?
          render json: { error: 'É necessário informar um telefone ou email para confirmar o pedido' }, status: :unprocessable_entity
          return
        end

        if @order.update(status: 'pending')
          @order.update_total_price
          render json: @order
        else
          error_message = @order.errors.full_messages.join(', ')
          render json: { error: error_message.presence || 'Erro ao confirmar pedido' }, status: :unprocessable_entity
        end
      end

      def deliver
        if @order.status == 'ready' && @order.update(status: 'delivered')
          render json: @order
        else
          render json: { error: 'Apenas pedidos prontos podem ser marcados como entregues' }, status: :unprocessable_entity
        end
      end

      def cancel
        service = OrderStatusService.new(@order)
        result = service.cancel!(params[:cancellation_reason])

        if result[:success]
          render json: @order.reload
        else
          render json: { error: result[:message] }, status: :unprocessable_entity
        end
      end

      def destroy
        order_code = @order.code
        if @order.destroy
          render json: { message: 'Pedido removido com sucesso!' }, status: :ok
        else
          error_message = @order.errors.full_messages.join(', ')
          Rails.logger.error "Erro ao deletar pedido #{order_code}: #{error_message}"
          render json: { error: error_message.presence || 'Erro ao remover pedido' }, status: :unprocessable_entity
        end
      rescue => e
        Rails.logger.error "Erro ao deletar pedido: #{e.message}\n#{e.backtrace.join("\n")}"
        render json: { error: "Erro ao remover pedido: #{e.message}" }, status: :internal_server_error
      end

      private

      def set_order
        @order = @establishment.orders.includes(:order_menu_items, order_menu_items: [:portion, menu_item: [:dish, :drink]]).find_by!(code: params[:code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Pedido não encontrado' }, status: :not_found
      rescue => e
        Rails.logger.error "Erro ao buscar pedido: #{e.message}\n#{e.backtrace.join("\n")}"
        render json: { error: "Erro ao buscar pedido: #{e.message}" }, status: :internal_server_error
      end

      def order_params
        if params[:order].present?
          params.require(:order).permit(:customer_name, :customer_email, :customer_phone, :customer_cpf)
        else
          {}
        end
      end
    end
  end
end   