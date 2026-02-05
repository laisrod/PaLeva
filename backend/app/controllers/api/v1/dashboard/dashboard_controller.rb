module Api
  module V1
    module Dashboard
      class DashboardController < ApplicationController
        include AuthenticableApi
        include ApiEstablishmentScoped

        before_action :authenticate_api_user!
        skip_before_action :verify_authenticity_token
        skip_before_action :create_current_order
        skip_before_action :set_active_storage_url_options

        # GET /api/v1/establishments/:code/dashboard/stats
        def stats
          # Parâmetros opcionais para filtrar por período
          period = params[:period] || 'day' # 'day', 'month', 'year'
          
          # Calcula as estatísticas
          stats_data = {
            period: period,
            total_orders: calculate_total_orders(period),
            total_revenue: calculate_total_revenue(period),
            orders_by_status: calculate_orders_by_status(period),
            top_items: calculate_top_items(period),
            sales_chart_data: calculate_sales_chart_data(period)
          }

          render json: stats_data, status: :ok
        rescue => e
          Rails.logger.error "[DashboardController] Erro ao calcular estatísticas: #{e.class} - #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: {
            status: :internal_server_error,
            error: ['Erro ao calcular estatísticas']
          }, status: :internal_server_error
        end

        private

        # Calcula o total de pedidos no período
        def calculate_total_orders(period)
          orders = filtered_orders(period)
          orders.count
        end

        # Calcula a receita total no período
        def calculate_total_revenue(period)
          orders = filtered_orders(period)
          # Soma apenas pedidos entregues (delivered)
          orders.where(status: 'delivered').sum(:total_price) || 0
        end

        # Calcula pedidos agrupados por status
        def calculate_orders_by_status(period)
          orders = filtered_orders(period)
          orders.group(:status).count.transform_keys(&:to_s)
        end

        # Calcula os itens mais vendidos
        def calculate_top_items(period, limit = 10)
          orders = filtered_orders(period).where(status: 'delivered')
          
          # Agrupa os itens vendidos e conta as quantidades
          items_hash = {}
          
          orders.includes(:order_menu_items).each do |order|
            order.order_menu_items.each do |item|
              item_name = get_item_name(item)
              items_hash[item_name] ||= { name: item_name, quantity: 0, revenue: 0 }
              items_hash[item_name][:quantity] += item.quantity || 0
              items_hash[item_name][:revenue] += calculate_item_revenue(item)
            end
          end
          
          # Ordena por quantidade e retorna os top N
          items_hash.values.sort_by { |item| -item[:quantity] }.first(limit)
        end

        # Calcula dados para gráfico de vendas (últimos 7 dias ou últimos 12 meses)
        def calculate_sales_chart_data(period)
          if period == 'day'
            # Últimos 7 dias
            (0..6).map do |days_ago|
              date = days_ago.days.ago.beginning_of_day
              revenue = @establishment.orders
                .where(status: 'delivered')
                .where(created_at: date..date.end_of_day)
                .sum(:total_price) || 0
              
              {
                date: date.strftime('%Y-%m-%d'),
                label: date.strftime('%d/%m'),
                revenue: revenue.to_f
              }
            end.reverse
          elsif period == 'month'
            # Últimos 12 meses
            (0..11).map do |months_ago|
              date = months_ago.months.ago.beginning_of_month
              revenue = @establishment.orders
                .where(status: 'delivered')
                .where(created_at: date..date.end_of_month)
                .sum(:total_price) || 0
              
              {
                date: date.strftime('%Y-%m'),
                label: date.strftime('%b/%Y'),
                revenue: revenue.to_f
              }
            end.reverse
          else
            # Últimos 30 dias (padrão)
            (0..29).map do |days_ago|
              date = days_ago.days.ago.beginning_of_day
              revenue = @establishment.orders
                .where(status: 'delivered')
                .where(created_at: date..date.end_of_day)
                .sum(:total_price) || 0
              
              {
                date: date.strftime('%Y-%m-%d'),
                label: date.strftime('%d/%m'),
                revenue: revenue.to_f
              }
            end.reverse
          end
        end

        # Filtra pedidos pelo período
        def filtered_orders(period)
          case period
          when 'day'
            @establishment.orders.where(created_at: Date.current.beginning_of_day..Date.current.end_of_day)
          when 'month'
            @establishment.orders.where(created_at: Date.current.beginning_of_month..Date.current.end_of_month)
          when 'year'
            @establishment.orders.where(created_at: Date.current.beginning_of_year..Date.current.end_of_year)
          else
            @establishment.orders.where(created_at: Date.current.beginning_of_day..Date.current.end_of_day)
          end
        end

        # Obtém o nome do item (menu, menu_item ou portion)
        def get_item_name(order_item)
          if order_item.menu_id
            menu = Menu.find_by(id: order_item.menu_id)
            menu&.name || "Menu ##{order_item.menu_id}"
          elsif order_item.menu_item_id
            menu_item = MenuItem.find_by(id: order_item.menu_item_id)
            menu_item&.name || "Item ##{order_item.menu_item_id}"
          elsif order_item.portion_id
            portion = Portion.find_by(id: order_item.portion_id)
            if portion&.dish
              "#{portion.dish.name} - #{portion.description}"
            elsif portion&.drink
              "#{portion.drink.name} - #{portion.description}"
            else
              "Porção ##{order_item.portion_id}"
            end
          else
            "Item ##{order_item.id}"
          end
        end

        # Calcula a receita de um item
        def calculate_item_revenue(order_item)
          if order_item.menu_id
            menu = Menu.find_by(id: order_item.menu_id)
            (menu&.price || 0) * (order_item.quantity || 0)
          elsif order_item.portion_id
            portion = Portion.find_by(id: order_item.portion_id)
            (portion&.price || 0) * (order_item.quantity || 0)
          else
            0
          end
        end
      end
    end
  end
end
