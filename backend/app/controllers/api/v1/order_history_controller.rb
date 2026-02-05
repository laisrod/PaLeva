module Api
  module V1
    class OrderHistoryController < ApplicationController
      include AuthenticableApi

      before_action :authenticate_api_user!
      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      skip_before_action :set_active_storage_url_options
      before_action :skip_session

      # GET /api/v1/orders/history
      def index
        # Se o usuário é owner, retorna pedidos do estabelecimento
        # Se não, retorna apenas os pedidos do próprio usuário
        if current_api_user.owner? && current_api_user.establishment.present?
          # Owner: todos os pedidos do estabelecimento
          orders = current_api_user.establishment.orders.includes(:establishment, :order_menu_items, :user)
        else
          # Cliente: apenas seus próprios pedidos
          orders = current_api_user.orders.includes(:establishment, :order_menu_items)
        end
        
        # Filtro por status
        if params[:status].present?
          orders = orders.where(status: params[:status])
        end
        
        # Filtro por data inicial
        if params[:start_date].present?
          start_date = Date.parse(params[:start_date])
          orders = orders.where('created_at >= ?', start_date.beginning_of_day)
        end
        
        # Filtro por data final
        if params[:end_date].present?
          end_date = Date.parse(params[:end_date])
          orders = orders.where('created_at <= ?', end_date.end_of_day)
        end
        
        # Ordena por data mais recente primeiro
        orders = orders.order(created_at: :desc)
        
        # Conta total antes da paginação
        total_count = orders.count
        
        # Paginação (opcional)
        page = params[:page]&.to_i || 1
        per_page = params[:per_page]&.to_i || 20
        orders = orders.limit(per_page).offset((page - 1) * per_page)
        
        render json: {
          orders: orders.map { |order| format_order(order) },
          pagination: {
            page: page,
            per_page: per_page,
            total: total_count,
            total_pages: (total_count.to_f / per_page).ceil
          }
        }, status: :ok
      rescue Date::Error => e
        render json: {
          error: 'Data inválida',
          message: 'Formato de data inválido. Use YYYY-MM-DD'
        }, status: :bad_request
      rescue => e
        Rails.logger.error "[OrderHistoryController] Erro: #{e.class} - #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        render json: {
          error: 'Erro ao buscar histórico de pedidos',
          message: e.message
        }, status: :internal_server_error
      end

      # GET /api/v1/orders/history/:id
      def show
        # Se o usuário é owner, pode ver qualquer pedido do estabelecimento
        # Se não, apenas seus próprios pedidos
        if current_api_user.owner? && current_api_user.establishment.present?
          order = current_api_user.establishment.orders.find_by(id: params[:id])
        else
          order = current_api_user.orders.find_by(id: params[:id])
        end
        
        if order
          render json: {
            order: format_order(order, include_items: true)
          }, status: :ok
        else
          render json: {
            error: 'Pedido não encontrado'
          }, status: :not_found
        end
      rescue => e
        Rails.logger.error "[OrderHistoryController] Erro: #{e.class} - #{e.message}"
        render json: {
          error: 'Erro ao buscar pedido',
          message: e.message
        }, status: :internal_server_error
      end

      private

      def skip_session
        request.session_options[:skip] = true if request.session_options
      rescue => e
        Rails.logger.warn "Erro ao pular sessão: #{e.message}"
      end

      def format_order(order, include_items: false)
        order_data = {
          id: order.id,
          code: order.code,
          status: order.status,
          total_price: order.total_price.to_f,
          created_at: order.created_at.iso8601,
          updated_at: order.updated_at.iso8601,
          establishment: {
            id: order.establishment.id,
            code: order.establishment.code,
            name: order.establishment.name
          }
        }
        
        # Adiciona informações do cliente se disponível
        if order.user.present?
          order_data[:customer] = {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email
          }
        elsif order.customer_name.present?
          order_data[:customer] = {
            name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone
          }
        end

        if include_items && order.order_menu_items.any?
          order_data[:order_menu_items] = order.order_menu_items.map do |item|
            format_order_item(item)
          end
        end

        order_data
      end

      def format_order_item(item)
        item_data = {
          id: item.id,
          quantity: item.quantity
        }

        if item.menu_id
          menu = Menu.find_by(id: item.menu_id)
          item_data[:menu] = menu ? {
            id: menu.id,
            name: menu.name,
            price: menu.price.to_f
          } : nil
        end

        if item.menu_item_id
          menu_item = MenuItem.includes(:dish, :drink).find_by(id: item.menu_item_id)
          if menu_item
            item_data[:menu_item] = {
              id: menu_item.id,
              name: menu_item.dish&.name || menu_item.drink&.name || "Item ##{menu_item.id}"
            }
          end
        end

        if item.portion_id
          portion = Portion.find_by(id: item.portion_id)
          if portion
            item_data[:portion] = {
              id: portion.id,
              description: portion.description,
              price: portion.price.to_f
            }
          end
        end

        item_data
      end
    end
  end
end
