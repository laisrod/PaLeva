module Api
  module V1
    class ReviewsController < ApplicationController
      include AuthenticableApi

      before_action :authenticate_api_user!
      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      skip_before_action :set_active_storage_url_options
      before_action :skip_session

      # POST /api/v1/orders/:order_id/reviews
      def create
        order = Order.find_by(id: params[:order_id])
        
        unless order
          return render json: { error: 'Pedido não encontrado' }, status: :not_found
        end
        
        # Verifica se o usuário pode avaliar este pedido
        unless can_review_order?(order)
          return render json: { error: 'Você não pode avaliar este pedido' }, status: :forbidden
        end
        
        # Verifica se já existe uma avaliação
        existing_review = Review.find_by(order_id: order.id, user_id: current_api_user.id)
        if existing_review
          return render json: { error: 'Você já avaliou este pedido' }, status: :unprocessable_entity
        end
        
        @review = Review.new(review_params)
        @review.order = order
        @review.user = current_api_user

        if @review.save
          render json: {
            review: format_review(@review),
            message: 'Avaliação criada com sucesso'
          }, status: :created
        else
          render json: {
            error: @review.errors.full_messages
          }, status: :unprocessable_entity
        end
      rescue => e
        Rails.logger.error "[ReviewsController] Erro: #{e.class} - #{e.message}"
        render json: {
          error: 'Erro ao criar avaliação',
          message: e.message
        }, status: :internal_server_error
      end

      # GET /api/v1/orders/:order_id/reviews
      def index
        order = Order.find_by(id: params[:order_id])
        
        unless order
          return render json: { error: 'Pedido não encontrado' }, status: :not_found
        end
        
        reviews = order.reviews.includes(:user).recent
        
        render json: {
          reviews: reviews.map { |review| format_review(review) },
          average_rating: order.reviews.average(:rating)&.round(2) || 0,
          total_reviews: reviews.count
        }, status: :ok
      rescue => e
        Rails.logger.error "[ReviewsController] Erro: #{e.class} - #{e.message}"
        render json: {
          error: 'Erro ao buscar avaliações',
          message: e.message
        }, status: :internal_server_error
      end

      # GET /api/v1/reviews/:id
      def show
        @review = Review.find_by(id: params[:id])
        
        if @review
          render json: {
            review: format_review(@review)
          }, status: :ok
        else
          render json: {
            error: 'Avaliação não encontrada'
          }, status: :not_found
        end
      rescue => e
        Rails.logger.error "[ReviewsController] Erro: #{e.class} - #{e.message}"
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

      def review_params
        params.require(:review).permit(:rating, :comment)
      end

      def can_review_order?(order)
        # Usuário pode avaliar se:
        # 1. É o dono do pedido (order.user_id == current_user.id)
        # 2. OU é o dono do estabelecimento
        return true if order.user_id == current_api_user.id
        return true if current_api_user.owner? && current_api_user.establishment_id == order.establishment_id
        
        false
      end

      def format_review(review)
        {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at.iso8601,
          updated_at: review.updated_at.iso8601,
          user: {
            id: review.user.id,
            name: review.user.name,
            email: review.user.email
          },
          order: {
            id: review.order.id,
            code: review.order.code
          }
        }
      end
    end
  end
end
