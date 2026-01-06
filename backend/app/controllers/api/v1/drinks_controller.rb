module Api
  module V1
    class DrinksController < ApplicationController
      include AuthenticableApi

      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      before_action :authenticate_api_user!
      before_action :set_establishment_for_owner

      # Lista todas as bebidas do estabelecimento
      def index
        @establishment = Establishment.find_by(code: params[:establishment_code])
        
        unless @establishment
          render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
          return
        end

        @drinks = @establishment.drinks

        render json: @drinks.as_json(
          only: %i[id name description calories alcoholic]
        )
      end
      
      # Cria uma nova bebida (requer autenticação de proprietário)
      def create
        @drink = @establishment.drinks.build(drink_params)

        if @drink.save
          render json: {
            drink: @drink.as_json(only: %i[id name description calories alcoholic]),
            message: 'Bebida criada com sucesso'
          }, status: :created
        else
          render json: {
            error: 'Não foi possível criar a bebida',
            errors: @drink.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def set_establishment_for_owner
        establishment_code = params[:establishment_code] || params[:establishment_id]
        @establishment = current_api_user.establishment
        
        unless @establishment && (@establishment.code == establishment_code || @establishment.id.to_s == establishment_code.to_s)
          render json: { error: 'Estabelecimento não encontrado ou sem permissão' }, status: :not_found
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def drink_params
        params.require(:drink).permit(:name, :description, :alcoholic, :calories, :photo, :status)
      end
    end
  end
end

