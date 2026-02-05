module Api
  module V1
    class RatingsController < ApplicationController
      include AuthenticableApi

      before_action :authenticate_api_user!
      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      skip_before_action :set_active_storage_url_options
      before_action :skip_session

      # POST /api/v1/establishments/:code/dishes/:dish_id/ratings
      # POST /api/v1/establishments/:code/drinks/:drink_id/ratings
      def create
        @establishment = Establishment.find_by!(code: params[:establishment_code])
        
        if params[:dish_id].present?
          item = @establishment.dishes.find_by(id: params[:dish_id])
          item_type = 'dish'
        elsif params[:drink_id].present?
          item = @establishment.drinks.find_by(id: params[:drink_id])
          item_type = 'drink'
        else
          return render json: { error: 'Deve especificar dish_id ou drink_id' }, status: :bad_request
        end
        
        unless item
          return render json: { error: "#{item_type.capitalize} não encontrado" }, status: :not_found
        end
        
        # Verifica se já existe uma avaliação
        existing_rating = if item_type == 'dish'
          Rating.find_by(dish_id: item.id, user_id: current_api_user.id)
        else
          Rating.find_by(drink_id: item.id, user_id: current_api_user.id)
        end
        
        if existing_rating
          return render json: { error: 'Você já avaliou este item' }, status: :unprocessable_entity
        end
        
        @rating = Rating.new(rating_params)
        @rating.user = current_api_user
        
        if item_type == 'dish'
          @rating.dish = item
        else
          @rating.drink = item
        end

        if @rating.save
          render json: {
            rating: format_rating(@rating),
            message: 'Avaliação criada com sucesso'
          }, status: :created
        else
          render json: {
            error: @rating.errors.full_messages
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      rescue => e
        Rails.logger.error "[RatingsController] Erro: #{e.class} - #{e.message}"
        render json: {
          error: 'Erro ao criar avaliação',
          message: e.message
        }, status: :internal_server_error
      end

      # GET /api/v1/establishments/:code/dishes/:dish_id/ratings
      # GET /api/v1/establishments/:code/drinks/:drink_id/ratings
      def index
        @establishment = Establishment.find_by!(code: params[:establishment_code])
        
        if params[:dish_id].present?
          item = @establishment.dishes.find_by(id: params[:dish_id])
          item_type = 'dish'
          ratings = Rating.where(dish_id: item.id).includes(:user).recent if item
        elsif params[:drink_id].present?
          item = @establishment.drinks.find_by(id: params[:drink_id])
          item_type = 'drink'
          ratings = Rating.where(drink_id: item.id).includes(:user).recent if item
        else
          return render json: { error: 'Deve especificar dish_id ou drink_id' }, status: :bad_request
        end
        
        unless item
          return render json: { error: "#{item_type.capitalize} não encontrado" }, status: :not_found
        end
        
        render json: {
          ratings: ratings.map { |rating| format_rating(rating) },
          average_rating: item.average_rating,
          total_ratings: item.ratings_count
        }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      rescue => e
        Rails.logger.error "[RatingsController] Erro: #{e.class} - #{e.message}"
        render json: {
          error: 'Erro ao buscar avaliações',
          message: e.message
        }, status: :internal_server_error
      end

      # GET /api/v1/ratings/:id
      def show
        @rating = Rating.find_by(id: params[:id])
        
        if @rating
          render json: {
            rating: format_rating(@rating)
          }, status: :ok
        else
          render json: {
            error: 'Avaliação não encontrada'
          }, status: :not_found
        end
      rescue => e
        Rails.logger.error "[RatingsController] Erro: #{e.class} - #{e.message}"
        render json: {
          error: 'Erro ao buscar avaliação',
          message: e.message
        }, status: :internal_server_error
      end

      private

      def skip_session
        request.session_options[:skip] = true if request.session_options
      rescue => e
        Rails.logger.warn "Erro ao pular sessão: #{e.message}"
      end

      def rating_params
        params.require(:rating).permit(:rating, :comment)
      end

      def format_rating(rating)
        {
          id: rating.id,
          rating: rating.rating,
          comment: rating.comment,
          created_at: rating.created_at.iso8601,
          updated_at: rating.updated_at.iso8601,
          user: {
            id: rating.user.id,
            name: rating.user.name,
            email: rating.user.email
          },
          dish: rating.dish ? {
            id: rating.dish.id,
            name: rating.dish.name
          } : nil,
          drink: rating.drink ? {
            id: rating.drink.id,
            name: rating.drink.name
          } : nil
        }
      end
    end
  end
end
