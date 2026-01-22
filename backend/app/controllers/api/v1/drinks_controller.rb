module Api
  module V1
    class DrinksController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment

      def index
        @drinks = @establishment.drinks
        render json: @drinks.as_json
      end

      def show
        @drink = @establishment.drinks.find(params[:id])
        render json: @drink.as_json
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Bebida não encontrada' }, status: :not_found
      end

      def create
        @drink = @establishment.drinks.new(drink_params)
      
        # Anexa a foto SE ela foi enviada no request
        photo_file = params.dig(:drink, :photo)  # ou params[:drink][:photo]
        if photo_file.present?
          @drink.photo.attach(photo_file)
        end
      
        if @drink.save
          # Gera a URL da foto (só se anexada)
          photo_url = @drink.photo.attached? ? rails_blob_url(@drink.photo) : nil
      
          render json: {
            drink: {
              id: @drink.id,
              name: @drink.name,
              description: @drink.description,
              alcoholic: @drink.alcoholic,
              calories: @drink.calories,
              # adicione outros campos que quiser
              photo_url: photo_url   # isso o frontend pode usar para <img src={drink.photo_url} />
            },
            message: 'Bebida criada com sucesso'
          }, status: :created
        else
          render json: {
            errors: @drink.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def set_establishment
        @establishment = Establishment.find_by!(code: params[:establishment_code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def drink_params
        params.require(:drink).permit(:name, :description, :alcoholic, :calories)
      end
    end
  end
end

