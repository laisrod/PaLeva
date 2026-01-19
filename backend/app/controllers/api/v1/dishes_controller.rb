module Api
  module V1
    class DishesController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment

      def index
        @dishes = @establishment.dishes.includes(:tags)
        @dishes = @dishes.joins(:tags).where(tags: { id: params[:tag_ids] }) if params[:tag_ids].present?
        render json: @dishes.as_json(include: { tags: { only: [:id, :name] } })
      end

      def show
        @dish = @establishment.dishes.find(params[:id])
        render json: @dish.as_json(include: { tags: { only: [:id, :name] } })
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Prato não encontrado' }, status: :not_found
      end

      def create
        @dish = @establishment.dishes.new(dish_params)

        if @dish.save
          render json: {
            dish: @dish.as_json(include: { tags: { only: [:id, :name] } }),
            message: 'Prato criado com sucesso'
          }, status: :created
        else
          render json: {
            status: :unprocessable_entity,
            error: @dish.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      end

      private

      def set_establishment
        @establishment = Establishment.find_by!(code: params[:establishment_code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def dish_params
        params.require(:dish).permit(:name, :description, :calories, :photo, tag_ids: [], tags_attributes: [:name])
      end
    end
  end
end

