module Api
  module V1
    class MenuItemsController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment
      before_action :set_menu

      def create
        @menu_item = @menu.menu_items.new(menu_item_params)

        if @menu_item.save
          # Associar porções selecionadas
          if params[:menu_item][:portion_ids].present?
            portion_ids = Array(params[:menu_item][:portion_ids]).map(&:to_i)
            portion_ids.each do |portion_id|
              @menu_item.menu_item_portions.create(portion_id: portion_id)
            end
          end

          render json: {
            menu_item: {
              id: @menu_item.id,
              dish: @menu_item.dish ? {
                id: @menu_item.dish.id,
                name: @menu_item.dish.name,
                description: @menu_item.dish.description
              } : nil,
              drink: @menu_item.drink ? {
                id: @menu_item.drink.id,
                name: @menu_item.drink.name,
                description: @menu_item.drink.description
              } : nil
            },
            message: 'Item adicionado ao cardápio com sucesso'
          }, status: :created
        else
          render json: {
            status: :unprocessable_entity,
            error: @menu_item.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActionController::ParameterMissing => e
        render json: {
          status: :bad_request,
          error: ["Parâmetros faltando: #{e.param}"]
        }, status: :bad_request
      end

      def update
        @menu_item = @menu.menu_items.find(params[:id])
        
        # Atualizar porções do menu_item
        if params[:menu_item][:portion_ids].present?
          portion_ids = Array(params[:menu_item][:portion_ids]).map(&:to_i)
          
          # Remover porções que não estão na lista
          @menu_item.menu_item_portions.where.not(portion_id: portion_ids).destroy_all
          
          # Adicionar novas porções
          existing_portion_ids = @menu_item.menu_item_portions.pluck(:portion_id)
          new_portion_ids = portion_ids - existing_portion_ids
          
          new_portion_ids.each do |portion_id|
            @menu_item.menu_item_portions.create(portion_id: portion_id)
          end
        end
        
        render json: {
          menu_item: {
            id: @menu_item.id,
            dish: @menu_item.dish ? {
              id: @menu_item.dish.id,
              name: @menu_item.dish.name,
              description: @menu_item.dish.description
            } : nil,
            drink: @menu_item.drink ? {
              id: @menu_item.drink.id,
              name: @menu_item.drink.name,
              description: @menu_item.drink.description
            } : nil
          },
          message: 'Porções atualizadas com sucesso'
        }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Item não encontrado' }, status: :not_found
      end

      def destroy
        @menu_item = @menu.menu_items.find(params[:id])
        
        if @menu_item.destroy
          render json: {
            message: 'Item removido do cardápio com sucesso'
          }, status: :ok
        else
          render json: {
            status: :unprocessable_entity,
            error: @menu_item.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Item não encontrado' }, status: :not_found
      end

      private

      def set_establishment
        @establishment = Establishment.find_by!(code: params[:establishment_code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def set_menu
        @menu = @establishment.menus.find(params[:menu_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Cardápio não encontrado' }, status: :not_found
      end

      def menu_item_params
        params.require(:menu_item).permit(:dish_id, :drink_id, portion_ids: [])
      end
    end
  end
end
