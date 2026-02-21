module Api
  module V1
    class MenusController < ApplicationController
      include ApiEstablishmentScoped
      skip_before_action :verify_authenticity_token

      def index
        unless @establishment
          Rails.logger.error "[MenusController#index] @establishment é nil"
          render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
          return
        end

        @menus = @establishment.menus
        menus_data = @menus.map do |menu|
          {
            id: menu.id,
            name: menu.name || '',
            description: menu.description || '',
            price: menu.price ? menu.price.to_f : 0.0,
            active: menu.active.nil? ? true : menu.active
          }
        end
        
        response.headers['Content-Type'] = 'application/json'
        render json: menus_data.to_json, status: :ok
      rescue => e
        Rails.logger.error "[MenusController#index] Erro: #{e.class} - #{e.message}"
        Rails.logger.error "[MenusController#index] Params: #{params.inspect}"
        Rails.logger.error "[MenusController#index] @establishment: #{@establishment.inspect}"
        Rails.logger.error e.backtrace.join("\n")
        render json: {
          error: 'Erro ao buscar cardápios',
          message: e.message
        }, status: :internal_server_error
      end

      def create
        @menu = @establishment.menus.new(menu_params)

        if @menu.save
          render json: {
            menu: @menu.as_json(only: [:id, :name, :description, :price]),
            message: 'Cardápio criado com sucesso'
          }, status: :created
        else
          render json: {
            status: :unprocessable_entity,
            error: @menu.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActionController::ParameterMissing => e
        render json: {
          status: :bad_request,
          error: ["Parâmetros faltando: #{e.param}"]
        }, status: :bad_request
      end

      def show
        @menu = @establishment.menus.find(params[:id])
        
        menu_items_with_portions = @menu.menu_items.map do |menu_item|
          dish_photo_url = nil
          if menu_item.dish
            begin
              dish_photo_url = menu_item.dish.photo.attached? ? url_for(menu_item.dish.photo) : nil
            rescue => e
              Rails.logger.error "Erro ao gerar photo_url para dish #{menu_item.dish.id}: #{e.message}"
              dish_photo_url = nil
            end
          end

          drink_photo_url = nil
          if menu_item.drink
            begin
              drink_photo_url = menu_item.drink.photo.attached? ? url_for(menu_item.drink.photo) : nil
            rescue => e
              Rails.logger.error "Erro ao gerar photo_url para drink #{menu_item.drink.id}: #{e.message}"
              drink_photo_url = nil
            end
          end

          # Obter apenas as porções selecionadas para este menu_item
          selected_portions = menu_item.portions.map { |p| { id: p.id, description: p.description, price: p.price.to_f } }
          
          item_data = {
            id: menu_item.id,
            dish: menu_item.dish ? {
              id: menu_item.dish.id,
              name: menu_item.dish.name,
              description: menu_item.dish.description,
              photo_url: dish_photo_url,
              portions: selected_portions,
              average_rating: menu_item.dish.average_rating,
              ratings_count: menu_item.dish.ratings_count
            } : nil,
            drink: menu_item.drink ? {
              id: menu_item.drink.id,
              name: menu_item.drink.name,
              description: menu_item.drink.description,
              photo_url: drink_photo_url,
              portions: selected_portions,
              average_rating: menu_item.drink.average_rating,
              ratings_count: menu_item.drink.ratings_count
            } : nil
          }
          item_data
        end
        
        render json: {
          id: @menu.id,
          name: @menu.name,
          description: @menu.description,
          price: @menu.price.to_f,
          menu_items: menu_items_with_portions
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Cardápio não encontrado' }, status: :not_found
      end

      def update
        @menu = @establishment.menus.find(params[:id])

        if @menu.update(menu_params)
          render json: {
            menu: @menu.as_json(only: [:id, :name, :description, :price]),
            message: 'Cardápio atualizado com sucesso'
          }, status: :ok
        else
          render json: {
            status: :unprocessable_entity,
            error: @menu.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Cardápio não encontrado' }, status: :not_found
      rescue ActionController::ParameterMissing => e
        render json: {
          status: :bad_request,
          error: ["Parâmetros faltando: #{e.param}"]
        }, status: :bad_request
      end

      def destroy
        @menu = @establishment.menus.find(params[:id])

        if @menu.destroy
          render json: {
            message: 'Cardápio excluído com sucesso'
          }, status: :ok
        else
          render json: {
            status: :unprocessable_entity,
            error: @menu.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Cardápio não encontrado' }, status: :not_found
      end

      private

      def menu_params
        params.require(:menu).permit(:name, :description, :price)
      end
    end
  end
end

