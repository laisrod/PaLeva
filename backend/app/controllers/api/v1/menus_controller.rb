module Api
  module V1
    class MenusController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment

      def index
        @menus = @establishment.menus
        render json: @menus.as_json(only: [:id, :name, :description])
      end

      def create
        @menu = @establishment.menus.new(menu_params)

        if @menu.save
          render json: {
            menu: @menu.as_json(only: [:id, :name, :description]),
            message: 'Cardápio criado com sucesso'
          }, status: :created
        else
          render json: {
            status: :unprocessable_entity,
            error: @menu.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActionController::ParameterMissing => e
        render json: {
          status: :bad_request,
          error: ["Parâmetros faltando: #{e.param}"]
        }, status: :bad_request
      end

      def show
        @menu = @establishment.menus.find(params[:id])
        render json: @menu.as_json(
          include: {
            menu_items: {
              include: {
                dish: { only: [:id, :name, :description] },
                drink: { only: [:id, :name, :description] }
              }
            }
          }
        )
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Cardápio não encontrado' }, status: :not_found
      end

      private

      def set_establishment
        @establishment = Establishment.find_by!(code: params[:establishment_code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def menu_params
        params.require(:menu).permit(:name, :description)
      end
    end
  end
end

