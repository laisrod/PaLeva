module Api
  module V1
    class DishesController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment

      def index
        @dishes = @establishment.dishes
      
        simple_dishes = @dishes.map { |d| { id: d.id, name: d.name } }
        render json: simple_dishes, status: :ok
      end

      def show
        @dish = @establishment.dishes.find(params[:id])
        render json: @dish.as_json(include: { tags: { only: [:id, :name] } })
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Prato não encontrado' }, status: :not_found
      end

      def create
        @dish = @establishment.dishes.new(dish_params)
        if @dish.save! 
          new_dish = {
            id: @dish.id,
            name: @dish.name,
            description: @dish.description,
            calories: @dish.calories,
            status: @dish.status,
            photo_url: @dish.photo.attached? ? url_for(@dish.photo) : nil,
            tags: @dish.tags.map { |tag| { id: tag.id, name: tag.name } }

          }
          render json: { dish: new_dish, message: 'Prato criado!' }, status: :created
        else
          render json: { status: :unprocessable_entity, error: @dish.errors.full_messages }, status: :unprocessable_entity
        end
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

