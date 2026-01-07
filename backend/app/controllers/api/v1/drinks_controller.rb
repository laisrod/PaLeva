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

        if @drink.save
          render json: {
            drink: @drink.as_json,
            message: 'Bebida criada com sucesso'
          }, status: :created
        else
          render json: {
            status: :unprocessable_entity,
            error: @drink.errors.full_messages.map(&:to_s)
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
        params.require(:drink).permit(:name, :description, :alcoholic, :calories, :photo)
      end
    end
  end
end

