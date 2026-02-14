module Api
  module V1
    class DrinksController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment

      def index
        @drinks = @establishment.drinks.includes(:tags, :portions, :ratings)
        
        if params[:tag_ids].present?
          tag_ids = Array(params[:tag_ids]).map(&:to_i)
          @drinks = @drinks.joins(:tags)
                          .where(tags: { id: tag_ids })
                          .distinct
        end
        
        render json: @drinks, status: :ok
      end

      def show
        @drink = @establishment.drinks.includes(:tags, :portions, :ratings).find(params[:id])
        render json: @drink, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Bebida não encontrada' }, status: :not_found
      end

      def create
        permitted_params = drink_params.dup
        photo_file = permitted_params.delete(:photo) if permitted_params[:photo]
        
        @drink = @establishment.drinks.new(permitted_params)
        
        if @drink.save
          @drink.photo.attach(photo_file) if photo_file
          @drink.reload
          
          render json: {
            drink: @drink,
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
        @drink = @establishment.drinks.includes(:tags, :portions).find(params[:id])
        permitted_params = drink_params.dup
        photo_file = permitted_params.delete(:photo) if permitted_params[:photo]
        
        if @drink.update(permitted_params)
          @drink.photo.attach(photo_file) if photo_file
          @drink.reload
          
          render json: {
            drink: @drink,
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
        @drink.destroy
        render json: { message: 'Bebida removida com sucesso!' }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Bebida não encontrada' }, status: :not_found
      rescue => e
        Rails.logger.error "Erro ao deletar bebida: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        render json: { error: "Erro ao remover bebida: #{e.message}" }, status: :internal_server_error
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

