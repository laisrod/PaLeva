module Api
  module V1
    class DrinksController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment

      def index
        @drinks = @establishment.drinks
        
        if params[:tag_ids].present?
          tag_ids = Array(params[:tag_ids]).map(&:to_i)
          @drinks = @drinks.joins(:tags)
                          .where(tags: { id: tag_ids })
                          .distinct
        end
        
        drinks_data = @drinks.map { |d| 
          photo_url = d.photo.attached? ? url_for(d.photo) : nil rescue nil
          prices = d.portions.pluck(:price)
          min_price = prices.min
          max_price = prices.max
          
          {
            id: d.id,
            name: d.name,
            description: d.description,
            alcoholic: d.alcoholic,
            calories: d.calories,
            photo_url: photo_url,
            tags: d.tags.map { |tag| { id: tag.id, name: tag.name } },
            min_price: min_price ? min_price.to_f : nil,
            max_price: max_price ? max_price.to_f : nil
          }
        }
        render json: drinks_data, status: :ok
      end

      def show
        @drink = @establishment.drinks.find(params[:id])
        prices = @drink.portions.pluck(:price)
        min_price = prices.min
        max_price = prices.max
        
        render json: {
          id: @drink.id,
          name: @drink.name,
          description: @drink.description,
          alcoholic: @drink.alcoholic,
          calories: @drink.calories,
          photo_url: @drink.photo.attached? ? url_for(@drink.photo) : nil,
          tags: @drink.tags.map { |tag| { id: tag.id, name: tag.name } },
          min_price: min_price ? min_price.to_f : nil,
          max_price: max_price ? max_price.to_f : nil
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Bebida não encontrada' }, status: :not_found
      end

      def create
        permitted_params = drink_params
        photo_file = permitted_params.delete(:photo) if permitted_params[:photo]
        
        @drink = @establishment.drinks.new(permitted_params)
        
        if @drink.save
          @drink.photo.attach(photo_file) if photo_file
          
          prices = @drink.portions.pluck(:price)
          min_price = prices.min
          max_price = prices.max
          
          render json: {
            drink: {
              id: @drink.id,
              name: @drink.name,
              description: @drink.description,
              alcoholic: @drink.alcoholic,
              calories: @drink.calories,
              photo_url: @drink.photo.attached? ? url_for(@drink.photo) : nil,
              tags: @drink.tags.map { |tag| { id: tag.id, name: tag.name } },
              min_price: min_price ? min_price.to_f : nil,
              max_price: max_price ? max_price.to_f : nil
            },
            message: 'Bebida criada com sucesso'
          }, status: :created
        else
          render json: {
            status: :unprocessable_entity,
            error: @drink.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def update
        @drink = @establishment.drinks.find(params[:id])
        permitted_params = drink_params
        photo_file = permitted_params.delete(:photo) if permitted_params[:photo]
        
        if @drink.update(permitted_params)
          @drink.photo.attach(photo_file) if photo_file
          
          prices = @drink.portions.pluck(:price)
          min_price = prices.min
          max_price = prices.max
          
          render json: {
            drink: {
              id: @drink.id,
              name: @drink.name,
              description: @drink.description,
              alcoholic: @drink.alcoholic,
              calories: @drink.calories,
              photo_url: @drink.photo.attached? ? url_for(@drink.photo) : nil,
              tags: @drink.tags.map { |tag| { id: tag.id, name: tag.name } },
              min_price: min_price ? min_price.to_f : nil,
              max_price: max_price ? max_price.to_f : nil
            },
            message: 'Bebida atualizada!'
          }, status: :ok
        else
          render json: { status: :unprocessable_entity, error: @drink.errors.full_messages }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Bebida não encontrada' }, status: :not_found
      end

      def destroy
        @drink = @establishment.drinks.find(params[:id])
        if @drink.destroy
          render json: { message: 'Bebida removida com sucesso!' }, status: :ok
        else
          render json: { error: 'Erro ao remover bebida' }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Bebida não encontrada' }, status: :not_found
      end

      private

      def set_establishment
        @establishment = Establishment.find_by!(code: params[:establishment_code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def drink_params
        params.require(:drink).permit(:name, :description, :alcoholic, :calories, :photo, tag_ids: [])
      end
    end
  end
end

