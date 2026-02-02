module Api
  module V1
    class MenuItemsController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_establishment
      before_action :set_menu

      def index
        @menu_items = @menu.menu_items.includes(:dish, :drink, :portions)
        render json: {
          menu_items: @menu_items.map do |item|
            {
              id: item.id,
              dish: item.dish ? {
                id: item.dish.id,
                name: item.dish.name,
                description: item.dish.description
              } : nil,
              drink: item.drink ? {
                id: item.drink.id,
                name: item.drink.name,
                description: item.drink.description
              } : nil,
              selected_portions: item.portions.map { |p| { id: p.id, description: p.description } }
            }
          end
        }, status: :ok
      rescue => e
        Rails.logger.error "Erro ao listar menu_items: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        render json: {
          error: "Erro ao listar itens do cardápio: #{e.message}",
          details: Rails.env.development? ? e.backtrace.first(5) : nil
        }, status: :internal_server_error
      end

      def create
        begin
          menu_item_data = menu_item_params
          
          if menu_item_data.empty?
            return render json: {
              status: :bad_request,
              error: ['Parâmetros do menu_item são obrigatórios']
            }, status: :bad_request
          end

          @menu_item = @menu.menu_items.new(menu_item_data)

          if @menu_item.save
            # Associar porções selecionadas
            if params[:menu_item] && params[:menu_item][:portion_ids].present?
              portion_ids = Array(params[:menu_item][:portion_ids]).map(&:to_i).reject(&:zero?)
              errors_creating_portions = []
              
              portion_ids.each do |portion_id|
                begin
                  # Verificar se a porção existe
                  portion = Portion.find_by(id: portion_id)
                  unless portion
                    errors_creating_portions << "Porção com ID #{portion_id} não encontrada"
                    next
                  end
                  
                  # Verificar se já existe para evitar duplicatas
                  unless @menu_item.menu_item_portions.exists?(portion_id: portion_id)
                    @menu_item.menu_item_portions.create!(portion_id: portion_id)
                  end
                rescue ActiveRecord::RecordNotUnique, ActiveRecord::RecordInvalid => e
                  # Ignorar se já existe (constraint UNIQUE)
                  if e.message.include?('UNIQUE') || e.message.include?('unique')
                    Rails.logger.info "Porção #{portion_id} já está associada ao menu_item #{@menu_item.id}"
                  else
                    errors_creating_portions << "Erro ao associar porção #{portion_id}: #{e.message}"
                    Rails.logger.error "Erro ao associar porção #{portion_id} ao menu_item: #{e.message}"
                  end
                rescue => e
                  # Verificar se é erro de constraint UNIQUE do SQLite
                  if e.message.include?('UNIQUE constraint failed')
                    Rails.logger.info "Porção #{portion_id} já está associada ao menu_item #{@menu_item.id}"
                  else
                    errors_creating_portions << "Erro ao associar porção #{portion_id}: #{e.message}"
                    Rails.logger.error "Erro ao associar porção #{portion_id} ao menu_item: #{e.message}"
                    Rails.logger.error e.backtrace.join("\n")
                  end
                end
              end
              
              if errors_creating_portions.any?
                Rails.logger.warn "Avisos ao associar porções: #{errors_creating_portions.join(', ')}"
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
        rescue => e
          Rails.logger.error "Erro ao criar menu_item: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: {
            error: "Erro ao adicionar item ao cardápio: #{e.message}",
            details: Rails.env.development? ? e.backtrace.first(5) : nil
          }, status: :internal_server_error
        end
      end

      def update
        begin
          @menu_item = @menu.menu_items.find(params[:id])
          
          # Atualizar porções do menu_item
          if params[:menu_item] && params[:menu_item][:portion_ids].present?
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
        rescue => e
          Rails.logger.error "Erro ao atualizar menu_item: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: {
            error: "Erro ao atualizar item do cardápio: #{e.message}",
            details: Rails.env.development? ? e.backtrace.first(5) : nil
          }, status: :internal_server_error
        end
      end

      def destroy
        begin
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
        rescue => e
          Rails.logger.error "Erro ao remover menu_item: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: {
            error: "Erro ao remover item do cardápio: #{e.message}",
            details: Rails.env.development? ? e.backtrace.first(5) : nil
          }, status: :internal_server_error
        end
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
        if params[:menu_item].present?
          params.require(:menu_item).permit(:dish_id, :drink_id, portion_ids: [])
        else
          {}
        end
      end
    end
  end
end
