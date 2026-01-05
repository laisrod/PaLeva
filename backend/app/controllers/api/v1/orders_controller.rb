module Api
  module V1
    class OrdersController < ApplicationController
      include AuthenticableApi
      include ApiEstablishmentScoped

      before_action :authenticate_api_user!
      before_action :set_order, only: [:show, :prepare_order, :cancel, :ready_order]
      skip_before_action :verify_authenticity_token

      def index
        @orders = @establishment.orders.recent
        @orders = @orders.with_status(params[:status]) if params[:status].present?

        render json: @orders
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
    end
  end
end   