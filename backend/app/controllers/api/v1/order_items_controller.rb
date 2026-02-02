module Api
  module V1
    class OrderItemsController < ApplicationController
      include AuthenticableApi
      include ApiEstablishmentScoped

      before_action :authenticate_api_user!
      before_action :set_order
      skip_before_action :verify_authenticity_token

      def create
        begin
          # Se menu_id foi fornecido, criar um único order_item representando o menu completo
          if params[:order_item] && params[:order_item][:menu_id].present?
            menu = @establishment.menus.find_by(id: params[:order_item][:menu_id].to_i)
            return render json: { error: 'Menu não encontrado' }, status: :not_found unless menu

            quantity = (params[:order_item][:quantity] || 1).to_i

            # Criar um único order_item representando o menu completo
            @order_item = @order.order_menu_items.new(
              menu_id: menu.id,
              quantity: quantity
            )

            if @order_item.save
              @order.reload
              render json: {
                order_item: {
                  id: @order_item.id,
                  quantity: @order_item.quantity,
                  menu_id: @order_item.menu_id,
                  menu: {
                    id: menu.id,
                    name: menu.name,
                    description: menu.description,
                    price: menu.price.to_f
                  }
                },
                order: {
                  id: @order.id,
                  code: @order.code,
                  status: @order.status,
                  total_price: @order.total_price.to_f
                },
                message: 'Menu adicionado ao pedido com sucesso'
              }, status: :created
            else
              render json: {
                status: :unprocessable_entity,
                error: @order_item.errors.full_messages
              }, status: :unprocessable_entity
            end
            return
          end

          # Se dish_id ou drink_id foi fornecido, criar ou encontrar menu_item
          menu_item = nil
          if params[:order_item] && params[:order_item][:dish_id].present?
            menu_item = find_or_create_menu_item_for_dish(params[:order_item][:dish_id].to_i)
          elsif params[:order_item] && params[:order_item][:drink_id].present?
            menu_item = find_or_create_menu_item_for_drink(params[:order_item][:drink_id].to_i)
          end

          # Se menu_item foi criado/encontrado, usar seu ID
          if menu_item
            # Criar hash apenas com os parâmetros permitidos
            order_item_params_hash = {
              menu_item_id: menu_item.id,
              portion_id: params[:order_item][:portion_id].to_i,
              quantity: (params[:order_item][:quantity] || 1).to_i
            }
            @order_item = @order.order_menu_items.new(order_item_params_hash)
          else
            # Se não há menu_item, usar apenas os parâmetros permitidos (sem dish_id/drink_id)
            permitted_params = order_item_params.to_h
            permitted_params.delete(:dish_id)
            permitted_params.delete(:drink_id)
            permitted_params.delete(:menu_id)
            @order_item = @order.order_menu_items.new(permitted_params)
          end

          if @order_item.save
            @order.reload
            render json: {
              order_item: {
                id: @order_item.id,
                quantity: @order_item.quantity,
                menu_item_id: @order_item.menu_item_id,
                portion_id: @order_item.portion_id,
                portion: {
                  id: @order_item.portion.id,
                  description: @order_item.portion.description,
                  price: @order_item.portion.price.to_f
                },
                menu_item: @order_item.menu_item ? {
                  id: @order_item.menu_item.id,
                  name: @order_item.menu_item.dish&.name || @order_item.menu_item.drink&.name
                } : nil
              },
              order: {
                id: @order.id,
                code: @order.code,
                status: @order.status,
                total_price: @order.total_price.to_f
              },
              message: 'Item adicionado ao pedido com sucesso'
            }, status: :created
          else
            render json: {
              status: :unprocessable_entity,
              error: @order_item.errors.full_messages
            }, status: :unprocessable_entity
          end
        rescue => e
          Rails.logger.error "Erro ao criar order_item: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: {
            error: "Erro ao adicionar item: #{e.message}",
            details: Rails.env.development? ? e.backtrace.first(5) : nil
          }, status: :internal_server_error
        end
      end

      def destroy
        item = @order.order_menu_items.find(params[:id])
        item.destroy!
        @order.reload
        render json: {
          message: 'Item removido do pedido',
          order: {
            id: @order.id,
            code: @order.code,
            status: @order.status,
            total_price: @order.total_price.to_f
          }
        }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Item não encontrado' }, status: :not_found
      end

      private

      def set_order
        @order = @establishment.orders.find_by!(code: params[:order_code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Pedido não encontrado' }, status: :not_found
      end

      def order_item_params
        params.require(:order_item).permit(:menu_item_id, :portion_id, :quantity, :dish_id, :drink_id, :menu_id)
      end

      def find_or_create_menu_item_for_dish(dish_id)
        dish = @establishment.dishes.find_by(id: dish_id)
        return nil unless dish

        # Buscar menu_item existente para este dish em qualquer menu
        menu_item = MenuItem.joins(:menu)
                           .where(menus: { establishment_id: @establishment.id })
                           .where(dish_id: dish_id)
                           .first

        # Se não encontrou, criar em um menu padrão ou no primeiro menu
        unless menu_item
          menu = @establishment.menus.first
          unless menu
            menu = @establishment.menus.create!(
              name: "Menu Geral #{Time.current.strftime('%Y%m%d')}",
              description: 'Menu para pedidos diretos'
            )
          end
          menu_item = menu.menu_items.create!(dish_id: dish_id)
        end

        menu_item
      rescue => e
        Rails.logger.error "Erro ao criar menu_item para dish: #{e.message}"
        raise
      end

      def find_or_create_menu_item_for_drink(drink_id)
        drink = @establishment.drinks.find_by(id: drink_id)
        return nil unless drink

        # Buscar menu_item existente para este drink em qualquer menu
        menu_item = MenuItem.joins(:menu)
                           .where(menus: { establishment_id: @establishment.id })
                           .where(drink_id: drink_id)
                           .first

        # Se não encontrou, criar em um menu padrão ou no primeiro menu
        unless menu_item
          menu = @establishment.menus.first
          unless menu
            menu = @establishment.menus.create!(
              name: "Menu Geral #{Time.current.strftime('%Y%m%d')}",
              description: 'Menu para pedidos diretos'
            )
          end
          menu_item = menu.menu_items.create!(drink_id: drink_id)
        end

        menu_item
      rescue => e
        Rails.logger.error "Erro ao criar menu_item para drink: #{e.message}"
        raise
      end
    end
  end
end
