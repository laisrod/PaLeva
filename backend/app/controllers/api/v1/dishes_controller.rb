module Api
  module V1
    class DishesController < ApplicationController
      include AuthenticableApi

      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      before_action :authenticate_api_user!
      before_action :set_establishment_for_owner, except: [:index]

      # Lista todos os pratos do estabelecimento
      def index
        @establishment = Establishment.find_by(code: params[:establishment_code])
        
        unless @establishment
          render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
          return
        end

        @dishes = @establishment.dishes.includes(:tags)
        
        # Filtrar por tags se fornecido
        if params[:tag_ids].present?
          tag_ids = params[:tag_ids].is_a?(Array) ? params[:tag_ids] : [params[:tag_ids]]
          @dishes = @dishes.joins(:tags).where(tags: { id: tag_ids }).distinct
        end

        render json: @dishes.as_json(
          only: %i[id name description calories],
          include: {
            tags: { only: %i[id name] }
          }
        )
      end

      # Cria um novo prato (requer autenticação de proprietário)
      def create
        @dish = @establishment.dishes.build(dish_params)

        if @dish.save
          render json: {
            dish: @dish.as_json(only: %i[id name description calories]),
            message: 'Prato criado com sucesso'
          }, status: :created
        else
          render json: {
            error: 'Não foi possível criar o prato',
            errors: @dish.errors.full_messages
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

      def dish_params
        params.require(:dish).permit(:name, :description, :calories, :photo, tag_ids: [], tags_attributes: [:name])
      end
    end
  end
end

