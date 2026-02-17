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
        # Associa o pedido ao usuário autenticado
        @order.user = current_api_user if current_api_user

        if @order.save
          @order.reload
          render json: {
            order: @order,
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
        @orders = @establishment.orders.includes(:order_menu_items).recent
        @orders = @orders.with_status(params[:status]) if params[:status].present?

        # Recalcular total_price se necessário
        @orders.each do |order|
          begin
            if order.total_price.nil? || order.total_price.zero?
              order.update_total_price
              order.save if order.changed?
            end
          rescue => e
            Rails.logger.error "Erro ao calcular total_price para pedido #{order.id}: #{e.message}"
          end
        end

        render json: @orders, status: :ok
      end

      def show
        Rails.logger.info "[Orders#show] GET order code=#{params[:code]} order_id=#{@order.id} items_count=#{@order.order_menu_items.size}"

        # Recalcular total_price se necessário
        if @order.total_price.nil? || @order.total_price.zero?
          @order.update_total_price
          @order.save if @order.changed?
        end

        render json: @order, status: :ok
      end

      def update
        if @order.update(order_params)
          @order.reload
          render json: @order, status: :ok
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
          @order.reload
          render json: @order, status: :ok
        else
          render json: { error: result[:message] }, status: :unprocessable_entity
        end
      end

      def ready_order
        if @order.status == 'preparing' && @order.update(status: 'ready')
          @order.update_total_price
          render json: @order, status: :ok
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
          render json: @order, status: :ok
        else
          error_message = @order.errors.full_messages.join(', ')
          render json: { error: error_message.presence || 'Erro ao confirmar pedido' }, status: :unprocessable_entity
        end
      end

      def deliver
        if @order.status == 'ready' && @order.update(status: 'delivered')
          render json: @order, status: :ok
        else
          render json: { error: 'Apenas pedidos prontos podem ser marcados como entregues' }, status: :unprocessable_entity
        end
      end

      def cancel
        service = OrderStatusService.new(@order)
        result = service.cancel!(params[:cancellation_reason])

        if result[:success]
          @order.reload
          render json: @order, status: :ok
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