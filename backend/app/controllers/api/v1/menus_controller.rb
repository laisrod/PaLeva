module Api
  module V1
    class MenusController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment

      def index
        @menus = @establishment.menus
        render json: @menus.as_json(only: [:id, :name, :description, :price])
      end

      def create
        @menu = @establishment.menus.new(menu_params)

        if @menu.save
          render json: {
            menu: @menu.as_json(only: [:id, :name, :description, :price]),
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
        
        menu_items_with_portions = @menu.menu_items.map do |menu_item|
          item_data = {
            id: menu_item.id,
            dish: menu_item.dish ? {
              id: menu_item.dish.id,
              name: menu_item.dish.name,
              description: menu_item.dish.description,
              portions: menu_item.dish.portions.map { |p| { id: p.id, description: p.description, price: p.price.to_f } }
            } : nil,
            drink: menu_item.drink ? {
              id: menu_item.drink.id,
              name: menu_item.drink.name,
              description: menu_item.drink.description,
              portions: menu_item.drink.portions.map { |p| { id: p.id, description: p.description, price: p.price.to_f } }
            } : nil
          }
          item_data
        end
        
        render json: {
          id: @menu.id,
          name: @menu.name,
          description: @menu.description,
          price: @menu.price.to_f,
          menu_items: menu_items_with_portions
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Cardápio não encontrado' }, status: :not_found
      end

      def update
        @menu = @establishment.menus.find(params[:id])

        if @menu.update(menu_params)
          render json: {
            menu: @menu.as_json(only: [:id, :name, :description, :price]),
            message: 'Cardápio atualizado com sucesso'
          }, status: :ok
        else
          render json: {
            status: :unprocessable_entity,
            error: @menu.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Cardápio não encontrado' }, status: :not_found
      rescue ActionController::ParameterMissing => e
        render json: {
          status: :bad_request,
          error: ["Parâmetros faltando: #{e.param}"]
        }, status: :bad_request
      end

      def destroy
        @menu = @establishment.menus.find(params[:id])

        if @menu.destroy
          render json: {
            message: 'Cardápio excluído com sucesso'
          }, status: :ok
        else
          render json: {
            status: :unprocessable_entity,
            error: @menu.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
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
        params.require(:menu).permit(:name, :description, :price)
      end
    end
  end
end

