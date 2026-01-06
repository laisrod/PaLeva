module Api
  module V1
    class MenusController < ApplicationController
      include AuthenticableApi

      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      before_action :authenticate_api_user!, except: [:show]
      before_action :set_establishment_for_owner, except: [:show]
      before_action :set_establishment_for_public, only: [:show]
      before_action :set_menu, only: [:show, :update, :destroy]

      # Lista todos os menus de um estabelecimento (requer autenticação de proprietário)
      def index
        @menus = @establishment.menus.order(created_at: :desc)
        render json: @menus.as_json(only: %i[id name description])
      end

      # Mostra um menu específico (público ou autenticado)
      def show
        menu_items = @menu.menu_items.includes(:dish, :drink).map do |menu_item|
          item = menu_item.dish || menu_item.drink
          next if item.nil?

          portions = item.portions.map do |portion|
            {
              id: portion.id,
              name: portion.name,
              price: portion.price.to_f
            }
          end

          default_price = portions.first&.dig(:price) || 0

          {
            id: item.id,
            menu_item_id: menu_item.id,
            name: item.name,
            description: item.description,
            price: default_price,
            portions: portions,
            category: item.is_a?(Dish) ? item.tags.first&.name || 'Geral' : 'Bebidas',
            image: (item.respond_to?(:photo) && item.photo.attached?) ? url_for(item.photo) : nil
          }
        end.compact

        render json: {
          establishment: {
            code: @establishment.code,
            name: @establishment.name
          },
          menu: {
            id: @menu.id,
            name: @menu.name,
            description: @menu.description,
            items: menu_items
          }
        }
      end

      # Cria um novo menu (requer autenticação de proprietário)
      def create
        @menu = @establishment.menus.build(menu_params)

        if @menu.save
          render json: {
            menu: @menu.as_json(only: %i[id name description]),
            message: 'Cardápio criado com sucesso'
          }, status: :created
        else
          render json: {
            error: 'Não foi possível criar o cardápio',
            errors: @menu.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # Atualiza um menu (requer autenticação de proprietário)
      def update
        if @menu.update(menu_params)
          render json: {
            menu: @menu.as_json(only: %i[id name description]),
            message: 'Cardápio atualizado com sucesso'
          }
        else
          render json: {
            error: 'Não foi possível atualizar o cardápio',
            errors: @menu.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # Remove um menu (requer autenticação de proprietário)
      def destroy
        if @menu.destroy
          render json: { message: 'Cardápio removido com sucesso' }
        else
          render json: {
            error: 'Não foi possível remover o cardápio'
          }, status: :unprocessable_entity
        end
      end

      private

      def set_establishment_for_owner
        establishment_code = params[:establishment_code] || params[:establishment_id]
        @establishment = current_api_user.establishment
        
        unless @establishment && (@establishment.code == establishment_code || @establishment.id.to_s == establishment_code.to_s)
          render json: { error: 'Estabelecimento não encontrado ou sem permissão' }, status: :not_found
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def set_establishment_for_public
        @establishment = Establishment.find_by!(code: params[:establishment_code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def set_menu
        if params[:id].present?
          # Para endpoints autenticados, usar o estabelecimento do usuário
          if @establishment
            @menu = @establishment.menus.find(params[:id])
          else
            # Fallback: buscar pelo ID diretamente
            @menu = Menu.find(params[:id])
            @establishment = @menu.establishment
          end
        else
          # Para o endpoint público, pega o primeiro menu
          @menu = @establishment.menus.first
        end
        
        unless @menu
          render json: { error: 'Cardápio não encontrado' }, status: :not_found
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Cardápio não encontrado' }, status: :not_found
      end

      def menu_params
        params.require(:menu).permit(:name, :description)
      end
    end
  end
end

