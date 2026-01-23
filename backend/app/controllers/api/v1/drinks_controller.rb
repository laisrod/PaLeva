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
          {
            id: d.id,
            name: d.name,
            description: d.description,
            alcoholic: d.alcoholic,
            calories: d.calories,
            photo_url: d.photo.attached? ? url_for(d.photo) : nil,
            tags: d.tags.map { |tag| { id: tag.id, name: tag.name } }
          }
        }
        render json: drinks_data, status: :ok
      end

      def show
        @drink = @establishment.drinks.find(params[:id])
        render json: {
          id: @drink.id,
          name: @drink.name,
          description: @drink.description,
          alcoholic: @drink.alcoholic,
          calories: @drink.calories,
          photo_url: @drink.photo.attached? ? url_for(@drink.photo) : nil,
          tags: @drink.tags.map { |tag| { id: tag.id, name: tag.name } }
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Bebida não encontrada' }, status: :not_found
      end

      def create
        @drink = @establishment.drinks.new(drink_params)
      
        if @drink.save
          photo_url = @drink.photo.attached? ? url_for(@drink.photo) : nil
      
          render json: {
            drink: {
              id: @drink.id,
              name: @drink.name,
              description: @drink.description,
              alcoholic: @drink.alcoholic,
              calories: @drink.calories,
              photo_url: photo_url,
              tags: @drink.tags.map { |tag| { id: tag.id, name: tag.name } }
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
        if @drink.update(drink_params)
          updated_drink = {
            id: @drink.id,
            name: @drink.name,
            description: @drink.description,
            alcoholic: @drink.alcoholic,
            calories: @drink.calories,
            photo_url: @drink.photo.attached? ? url_for(@drink.photo) : nil,
            tags: @drink.tags.map { |tag| { id: tag.id, name: tag.name } }
          }
          render json: { drink: updated_drink, message: 'Bebida atualizada!' }, status: :ok
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

