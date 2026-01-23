module Api
  module V1
    class DrinksPortionsController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment
      before_action :set_drink
      before_action :set_portion, only: [:show, :update, :destroy]

      def index
        @portions = @drink.portions.order(created_at: :desc)
        render json: @portions.map { |p| 
          {
            id: p.id,
            description: p.description,
            price: p.price.to_f,
            created_at: p.created_at,
            updated_at: p.updated_at
          }
        }, status: :ok
      end

      def show
        render json: {
          id: @portion.id,
          description: @portion.description,
          price: @portion.price.to_f,
          created_at: @portion.created_at,
          updated_at: @portion.updated_at
        }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Porção não encontrada' }, status: :not_found
      end

      def create
        @portion = @drink.portions.new(portion_params)
        if @portion.save
          render json: {
            portion: {
              id: @portion.id,
              description: @portion.description,
              price: @portion.price.to_f,
              created_at: @portion.created_at,
              updated_at: @portion.updated_at
            },
            message: 'Porção criada com sucesso!'
          }, status: :created
        else
          render json: { 
            status: :unprocessable_entity, 
            error: @portion.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      def update
        if @portion.update(portion_params)
          render json: {
            portion: {
              id: @portion.id,
              description: @portion.description,
              price: @portion.price.to_f,
              created_at: @portion.created_at,
              updated_at: @portion.updated_at
            },
            message: 'Porção atualizada com sucesso!'
          }, status: :ok
        else
          render json: { 
            status: :unprocessable_entity, 
            error: @portion.errors.full_messages 
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Porção não encontrada' }, status: :not_found
      end

      def destroy
        @portion.price_histories.destroy_all if @portion.respond_to?(:price_histories)
        if @portion.destroy
          render json: { message: 'Porção removida com sucesso!' }, status: :ok
        else
          render json: { error: 'Erro ao remover porção' }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Porção não encontrada' }, status: :not_found
      end

      private

      def set_establishment
        @establishment = Establishment.find_by!(code: params[:establishment_code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def set_drink
        @drink = @establishment.drinks.find(params[:drink_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Bebida não encontrada' }, status: :not_found
      end

      def set_portion
        @portion = @drink.portions.find(params[:id])
      end

      def portion_params
        params.require(:portion).permit(:description, :price)
      end
    end
  end
end
