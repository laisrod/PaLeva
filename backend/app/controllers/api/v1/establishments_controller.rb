module Api
  module V1
    class EstablishmentsController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :authenticate_api_user_for_create!, only: [:create]
      
      def index
        @establishments = Establishment.all
        render json: @establishments, status: :ok
      end

      def show
        @establishment = Establishment.includes(:working_hours).find_by!(code: params[:code])
        render json: @establishment, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def create
        @establishment = Establishment.new(establishment_params)
        @establishment.user = current_api_user

        if @establishment.save
          render json: {
            establishment: @establishment,
            message: 'Estabelecimento criado com sucesso'
          }, status: :created
        else
          render json: {
            status: :unprocessable_entity,
            error: @establishment.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActionController::ParameterMissing => e
        render json: {
          status: :bad_request,
          error: ["Parâmetros faltando: #{e.param}"]
        }, status: :bad_request
      end

      def update
        @establishment = Establishment.find_by!(code: params[:code])
        if @establishment.update(establishment_params)
          render json: {
            establishment: @establishment,
            message: 'Estabelecimento atualizado com sucesso'
          }, status: :ok
        else
          render json: {
            status: :unprocessable_entity,
            error: @establishment.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      rescue ActionController::ParameterMissing => e
        render json: {
          status: :bad_request,
          error: ["Parâmetros faltando: #{e.param}"]
        }, status: :bad_request
      end

      # GET /api/v1/establishments/:code/menu
      def public_menu
        @establishment = Establishment.find_by!(code: params[:code] || params[:establishment_code])
        
        dishes = @establishment.dishes.map do |dish|
          prices = dish.portions.pluck(:price)
          min_price = prices.min
          max_price = prices.max
          photo_url = nil
          begin
            photo_url = dish.photo.attached? ? url_for(dish.photo) : nil
          rescue => e
            Rails.logger.error "Erro ao gerar photo_url: #{e.message}"
          end
          
          {
            id: dish.id,
            name: dish.name,
            description: dish.description,
            calories: dish.calories,
            photo_url: photo_url,
            tags: dish.tags.map { |tag| { id: tag.id, name: tag.name } },
            min_price: min_price ? min_price.to_f : nil,
            max_price: max_price ? max_price.to_f : nil,
            average_rating: dish.average_rating,
            ratings_count: dish.ratings_count,
            category: 'Pratos',
            menu_item_id: dish.menu_items.first&.id,
            portions: dish.portions.map { |p| { id: p.id, name: p.description, price: p.price.to_f } }
          }
        end
        
        drinks = @establishment.drinks.map do |drink|
          prices = drink.portions.pluck(:price)
          min_price = prices.min
          max_price = prices.max
          photo_url = nil
          begin
            photo_url = drink.photo.attached? ? url_for(drink.photo) : nil
          rescue => e
            Rails.logger.error "Erro ao gerar photo_url: #{e.message}"
          end
          
          {
            id: drink.id,
            name: drink.name,
            description: drink.description,
            alcoholic: drink.alcoholic,
            calories: drink.calories,
            photo_url: photo_url,
            tags: drink.tags.map { |tag| { id: tag.id, name: tag.name } },
            min_price: min_price ? min_price.to_f : nil,
            max_price: max_price ? max_price.to_f : nil,
            average_rating: drink.average_rating,
            ratings_count: drink.ratings_count,
            category: 'Bebidas',
            menu_item_id: drink.menu_items.first&.id,
            portions: drink.portions.map { |p| { id: p.id, name: p.description, price: p.price.to_f } }
          }
        end
        
        menus = @establishment.menus.where(active: true).map do |menu|
          menu_price = menu.price ? menu.price.to_f : 0.0
          {
            id: menu.id,
            name: menu.name,
            description: menu.description,
            photo_url: nil, # Menus não têm foto própria
            min_price: menu_price,
            max_price: menu_price,
            price: menu_price,
            average_rating: 0,
            ratings_count: 0,
            category: 'Menus',
            menu_id: menu.id,
            portions: [] # Menus não têm porções, têm preço fixo
          }
        end
        
        all_items = dishes + drinks + menus
        
        render json: {
          menu: {
            items: all_items
          }
        }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      rescue => e
        Rails.logger.error "[EstablishmentsController] Erro: #{e.class} - #{e.message}"
        render json: {
          error: 'Erro ao buscar menu',
          message: e.message
        }, status: :internal_server_error
      end

      private

      def authenticate_api_user_for_create!
        email = request.headers['Authorization']&.split&.last
        @current_api_user = email ? User.find_by(email: email) : nil
        
        unless @current_api_user
          render json: { error: 'Não autorizado' }, status: :unauthorized
        end
      end

      def current_api_user
        @current_api_user
      end

      def establishment_params
        params.require(:establishment).permit(
          :name, :social_name, :cnpj, :full_address, 
          :city, :state, :postal_code, :email, :phone_number
        )
      end
    end
  end
end

