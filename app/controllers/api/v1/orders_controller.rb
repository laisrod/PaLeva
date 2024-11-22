module Api
    module V1
      class OrdersController < ApplicationController
        before_action :set_establishment_by_code
        before_action :set_order, only: [:show, :prepare_order, :cancel, :ready_order]
        skip_before_action :verify_authenticity_token


        def index
          @orders = if params[:status].present? && Order.statuses.keys.include?(params[:status])
            @establishment.orders.where(status: params[:status])
          else
            @establishment.orders
          end
          
          render json: @orders
        end

        def show
          @order_menu_items = @order.order_menu_items
          render json: @order, include: ['order_menu_items'], methods: [:cancellation_reason]
        end

        def prepare_order
          if @order.update(status: 'preparing')
            render json: @order
          else
            render json: @order.errors, status: :unprocessable_entity
          end
        end

        def ready_order
          if @order.update(status: 'ready')
            render json: @order
          else
            render json: @order.errors, status: :unprocessable_entity
          end
        end

        def cancel
          cancellation_reason = params[:cancellation_reason] || params.dig(:order, :cancellation_reason)
          
          Rails.logger.info "Cancellation Reason before update: #{cancellation_reason}"
          Rails.logger.info "Order attributes before update: #{@order.attributes}"
          
          result = @order.update_columns(
            status: 'cancelled',
            cancellation_reason: cancellation_reason,
            updated_at: Time.current
          )
          
          Rails.logger.info "Order attributes after update: #{@order.attributes}"
          Rails.logger.info "Order errors: #{@order.errors.full_messages}" unless result
          
          if result
            render json: @order
          else
            render json: @order.errors, status: :unprocessable_entity
          end
        end
  
        private
  
        def set_establishment_by_code
          @establishment = Establishment.find_by!(code: params[:establishment_code])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
        end

        def set_order
          @order = @establishment.orders.find_by!(code: params[:code])
        end

        def verify_establishment_access
          unless current_user.establishment == @establishment
            render json: { error: 'Acesso não autorizado' }, status: :unauthorized
          end
        end
      end
    end
  end   