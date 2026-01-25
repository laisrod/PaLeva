module Api
  module V1
    class DishesController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment

      def index
        @dishes = @establishment.dishes
        
        if params[:tag_ids].present?
          tag_ids = Array(params[:tag_ids]).map(&:to_i)
          @dishes = @dishes.joins(:tags)
                          .where(tags: { id: tag_ids })
                          .distinct
        end
        
        dishes_with_tags = @dishes.map { |d| 
          prices = d.portions.pluck(:price)
          min_price = prices.min
          max_price = prices.max
          
          {
            id: d.id,
            name: d.name,
            description: d.description,
            calories: d.calories,
            photo_url: d.photo.attached? ? url_for(d.photo) : nil,
            tags: d.tags.map { |tag| { id: tag.id, name: tag.name } },
            min_price: min_price ? min_price.to_f : nil,
            max_price: max_price ? max_price.to_f : nil
          }
        }
        render json: dishes_with_tags, status: :ok
      end

      def show
        @dish = @establishment.dishes.find(params[:id])
        prices = @dish.portions.pluck(:price)
        min_price = prices.min
        max_price = prices.max
        
        render json: {
          id: @dish.id,
          name: @dish.name,
          description: @dish.description,
          calories: @dish.calories,
          photo_url: @dish.photo.attached? ? url_for(@dish.photo) : nil,
          tags: @dish.tags.map { |tag| { id: tag.id, name: tag.name } },
          min_price: min_price ? min_price.to_f : nil,
          max_price: max_price ? max_price.to_f : nil
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Prato não encontrado' }, status: :not_found
      end

      def create
        permitted_params = dish_params
        photo_file = permitted_params.delete(:photo) if permitted_params[:photo]
        
        @dish = @establishment.dishes.new(permitted_params)
        
        if @dish.save! 
          @dish.photo.attach(photo_file) if photo_file
          
          prices = @dish.portions.pluck(:price)
          min_price = prices.min
          max_price = prices.max
          
          render json: {
            dish: {
              id: @dish.id,
              name: @dish.name,
              description: @dish.description,
              calories: @dish.calories,
              status: @dish.status,
              photo_url: @dish.photo.attached? ? url_for(@dish.photo) : nil,
              tags: @dish.tags.map { |tag| { id: tag.id, name: tag.name } },
              min_price: min_price ? min_price.to_f : nil,
              max_price: max_price ? max_price.to_f : nil
            },
            message: 'Prato criado!'
          }, status: :created
        else
          render json: { status: :unprocessable_entity, error: @dish.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        @dish = @establishment.dishes.find(params[:id])
        permitted_params = dish_params
        photo_file = permitted_params.delete(:photo) if permitted_params[:photo]
        
        if @dish.update(permitted_params)
          @dish.photo.attach(photo_file) if photo_file
          
          prices = @dish.portions.pluck(:price)
          min_price = prices.min
          max_price = prices.max
          
          render json: {
            dish: {
              id: @dish.id,
              name: @dish.name,
              description: @dish.description,
              calories: @dish.calories,
              status: @dish.status,
              photo_url: @dish.photo.attached? ? url_for(@dish.photo) : nil,
              tags: @dish.tags.map { |tag| { id: tag.id, name: tag.name } },
              min_price: min_price ? min_price.to_f : nil,
              max_price: max_price ? max_price.to_f : nil
            },
            message: 'Prato atualizado!'
          }, status: :ok
        else
          render json: { status: :unprocessable_entity, error: @dish.errors.full_messages }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Prato não encontrado' }, status: :not_found
      end

      def destroy
        @dish = @establishment.dishes.find(params[:id])
        if @dish.destroy
          render json: { message: 'Prato removido com sucesso!' }, status: :ok
        else
          render json: { error: 'Erro ao remover prato' }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Prato não encontrado' }, status: :not_found
      end

      private

      def set_establishment
        @establishment = Establishment.find_by!(code: params[:establishment_code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def dish_params
        params.require(:dish).permit(:name, :description, :calories, :photo, tag_ids: [])
      end
    end
  end
end

