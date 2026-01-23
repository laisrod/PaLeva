module Api
  module V1
    class OrdersController < ApplicationController
      include AuthenticableApi
      include ApiEstablishmentScoped

      before_action :authenticate_api_user!
      before_action :set_order, only: [:show, :prepare_order, :cancel, :ready_order]
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
          {
            id: order.id,
            code: order.code,
            status: order.status,
            total_price: order.total_price.to_f,
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
        render json: @order, include: ['order_menu_items'], methods: [:cancellation_reason]
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

      def cancel
        service = OrderStatusService.new(@order)
        result = service.cancel!(params[:cancellation_reason])

        if result[:success]
          render json: @order.reload
        else
          render json: { error: result[:message] }, status: :unprocessable_entity
        end
      end

      private

      def set_order
        @order = @establishment.orders.find_by!(code: params[:code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Pedido não encontrado' }, status: :not_found
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