module Api
  module V1
    class DishesController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment

      def index
        @dishes = @establishment.dishes.includes(:tags, :portions, :ratings)
        
        if params[:tag_ids].present?
          tag_ids = Array(params[:tag_ids]).map(&:to_i)
          @dishes = @dishes.joins(:tags)
                          .where(tags: { id: tag_ids })
                          .distinct
        end
        
        render json: @dishes, status: :ok
      end

      def show
        @dish = @establishment.dishes.includes(:tags, :portions, :ratings).find(params[:id])
        render json: @dish, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Prato não encontrado' }, status: :not_found
      end

      def create
        permitted_params = dish_params
        photo_file = permitted_params.delete(:photo) if permitted_params[:photo]
        
        @dish = @establishment.dishes.new(permitted_params)
        
        if @dish.save! 
          @dish.photo.attach(photo_file) if photo_file
          @dish.reload
          
          render json: {
            dish: @dish,
            message: 'Prato criado!'
          }, status: :created
        else
          render json: { status: :unprocessable_entity, error: @dish.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        @dish = @establishment.dishes.includes(:tags, :portions).find(params[:id])
        permitted_params = dish_params
        photo_file = permitted_params.delete(:photo) if permitted_params[:photo]
        
        if @dish.update(permitted_params)
          @dish.photo.attach(photo_file) if photo_file
          @dish.reload
          
          render json: {
            dish: @dish,
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

