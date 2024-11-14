module Api
    module V1
      class OrdersController < ApplicationController
        skip_before_action :authenticate_user!
        before_action :set_establishment_by_code
        
        def index
          @orders = if params[:status].present? && Order.statuses.keys.include?(params[:status])
            @establishment.orders.where(status: params[:status])
          else
            @establishment.orders
          end
          
          render json: @orders
        end

        def show
          @order = Order.find_by(code: params[:code])
          @order_menu_items = @order.order_menu_items
          render json: @order, include: ['order_menu_items']
        end
  
        private
  
        def set_establishment_by_code
          @establishment = Establishment.find_by!(code: params[:establishment_code])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
        end
      end
    end
  end   