module Api
  module V1
    class TagsController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment

      def index
        # Buscar tags através dos pratos do estabelecimento
        @tags = Tag.joins(:dishes).where(dishes: { establishment_id: @establishment.id }).distinct
        render json: @tags.as_json(only: [:id, :name])
      end

      def create
        @tag = Tag.find_or_initialize_by(name: tag_params[:name])
        
        unless @tag.save
          render json: {
            status: :unprocessable_entity,
            error: @tag.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
          return
        end

        render json: {
          tag: @tag.as_json(only: [:id, :name]),
          message: 'Tag criada com sucesso'
        }, status: :created
      rescue => e
        render json: {
          status: :unprocessable_entity,
          error: [e.message]
        }, status: :unprocessable_entity
      end

      private

      def set_establishment
        @establishment = Establishment.find_by!(code: params[:establishment_code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def tag_params
        params.require(:tag).permit(:name)
      end
    end
  end
end

