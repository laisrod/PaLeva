module Api
  module V1
    class TagsController < ApplicationController
      include AuthenticableApi

      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      before_action :authenticate_api_user!

      # Lista todas as tags disponíveis
      def index
        @tags = Tag.all.order(:name)
        render json: @tags.as_json(only: %i[id name])
      end

      # Cria uma nova tag
      def create
        @tag = Tag.new(tag_params)

        if @tag.save
          render json: {
            tag: @tag.as_json(only: %i[id name]),
            message: 'Característica criada com sucesso'
          }, status: :created
        else
          render json: {
            error: 'Não foi possível criar a característica',
            errors: @tag.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def tag_params
        params.require(:tag).permit(:name)
      end
    end
  end
end

