module Web
  module Establishments
    class OrdersController < ApplicationController
      include EstablishmentScoped
      include Authorizable

      before_action :check_establishment!
      before_action :set_establishment
      before_action :set_order, only: [:show, :update, :change_status, :cancel, :remove_item]
      before_action :authorize_owner!, only: [:update, :change_status, :cancel]

      def index
        @orders = @establishment.orders.recent.page(params[:page]).per(20)
      end

      def update
        if @order.update(order_params)
          redirect_to establishment_order_path(@establishment, @order), notice: 'Pedido atualizado com sucesso'
        else
          flash.now[:alert] = @order.errors.full_messages.join(', ')
          render :show, status: :unprocessable_entity
        end
      end

      def show
      end

      def add_item
        @order = current_order
        @menu_item = MenuItem.find(params[:menu_item_id])
        @order_menu_item = @order.order_menu_items.build
      end

      def save_item
        @order = current_order
        result = OrderItemService.add_item(@order, order_menu_item_params)

        if result[:success]
          redirect_to establishment_order_path(@order.establishment, @order), notice: 'Item adicionado com sucesso'
        else
          @menu_item = MenuItem.find(order_menu_item_params[:menu_item_id])
          @establishment = @order.establishment
          flash.now[:alert] = result[:error]
          render :add_item, status: :unprocessable_entity
        end
      end

      def remove_item
        result = OrderItemService.remove_item(@order, params[:item_id])
        redirect_to establishment_order_path(@establishment, @order)
      end

      def change_status
        service = OrderStatusService.new(@order)
        result = service.progress!

        if result[:success]
          redirect_to establishment_order_path(@establishment, @order), notice: result[:notice]
        else
          redirect_to establishment_order_path(@establishment, @order), alert: result[:message]
        end
      end

      def cancel
        service = OrderStatusService.new(@order)
        result = service.cancel!

        if result[:success]
          redirect_to establishment_order_path(@establishment, @order), notice: result[:notice]
        else
          redirect_to establishment_order_path(@establishment, @order), alert: result[:message]
        end
      end

      private

      def set_establishment
        @establishment = Establishment.find(params[:establishment_id])
      end

      def set_order
        @order = @establishment.orders.find(params[:id])
      end

      def order_params
        params.require(:order).permit(
          :customer_name,
          :customer_email,
          :customer_cpf,
          :customer_phone
        )
      end

      def order_menu_item_params
        params.require(:order_menu_item).permit(:portion_id, :menu_item_id, :quantity)
      end
    end
  end
end
