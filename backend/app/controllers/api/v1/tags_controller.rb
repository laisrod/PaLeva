module Api
  module V1
    class TagsController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment

      def index
        @tags = if params[:category].present?
                  Tag.where(category: params[:category]).order(:name)
                else
                  Tag.order(:name)
                end
        render json: @tags.as_json(only: [:id, :name, :category])
      end

      def show
        @tag = Tag.find(params[:id])
        render json: @tag.as_json(only: [:id, :name, :category])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Característica não encontrada' }, status: :not_found
      end

      def create
        @tag = Tag.find_or_initialize_by(name: tag_params[:name], category: tag_params[:category])
        
        unless @tag.save
          render json: {
            status: :unprocessable_entity,
            error: @tag.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
          return
        end

        render json: {
          tag: @tag.as_json(only: [:id, :name, :category]),
          message: 'Tag criada com sucesso'
        }, status: :created
      rescue => e
        render json: {
          status: :unprocessable_entity,
          error: [e.message]
        }, status: :unprocessable_entity
      end

      def update
        @tag = Tag.find(params[:id])
        if @tag.update(tag_params)
          render json: {
            tag: @tag.as_json(only: [:id, :name, :category]),
            message: 'Característica atualizada com sucesso'
          }, status: :ok
        else
          render json: {
            status: :unprocessable_entity,
            error: @tag.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Característica não encontrada' }, status: :not_found
      end

      def destroy
        @tag = Tag.find(params[:id])
        @tag.destroy!
        render json: { message: 'Característica excluída com sucesso' }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Característica não encontrada' }, status: :not_found
      end

      private

      def set_establishment
        code = params[:establishment_code] || params[:code]
        @establishment = Establishment.find_by!(code: code)
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def tag_params
        params.require(:tag).permit(:name, :category)
      end
    end
  end
end

