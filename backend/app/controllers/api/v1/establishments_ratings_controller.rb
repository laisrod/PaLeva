module Api
  module V1
    class EstablishmentsRatingsController < ApplicationController
      include AuthenticableApi

      before_action :authenticate_api_user!
      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      skip_before_action :set_active_storage_url_options
      before_action :skip_session
      before_action :set_establishment

      # GET /api/v1/establishments/:code/ratings
        def index
          # Verifica se o usuário é dono do estabelecimento
          unless current_api_user.owner? && current_api_user.establishment&.id == @establishment.id
            return render json: { error: 'Acesso negado' }, status: :forbidden
          end

        # Busca todas as avaliações de pedidos (reviews) do estabelecimento
        order_reviews = Review.joins(:order)
                             .where(orders: { establishment_id: @establishment.id })
                             .includes(:user, :order)
                             .recent
                             .limit(50)

        # Busca todas as avaliações de pratos e bebidas (ratings) do estabelecimento
        dish_ratings = Rating.joins(:dish)
                             .where(dishes: { establishment_id: @establishment.id })
                             .includes(:user, :dish)
                             .recent
                             .limit(50)

        drink_ratings = Rating.joins(:drink)
                              .where(drinks: { establishment_id: @establishment.id })
                              .includes(:user, :drink)
                              .recent
                              .limit(50)

        # Estatísticas gerais
        total_order_reviews = Review.joins(:order)
                                    .where(orders: { establishment_id: @establishment.id })
                                    .count

        total_dish_ratings = Rating.joins(:dish)
                                   .where(dishes: { establishment_id: @establishment.id })
                                   .count

        total_drink_ratings = Rating.joins(:drink)
                                    .where(drinks: { establishment_id: @establishment.id })
                                    .count

        avg_order_rating = Review.joins(:order)
                                .where(orders: { establishment_id: @establishment.id })
                                .average(:rating)&.round(2) || 0

        avg_dish_rating = Rating.joins(:dish)
                                .where(dishes: { establishment_id: @establishment.id })
                                .average(:rating)&.round(2) || 0

        avg_drink_rating = Rating.joins(:drink)
                                 .where(drinks: { establishment_id: @establishment.id })
                                 .average(:rating)&.round(2) || 0

        render json: {
          order_reviews: order_reviews.map { |review| format_review(review) },
          dish_ratings: dish_ratings.map { |rating| format_rating(rating) },
          drink_ratings: drink_ratings.map { |rating| format_rating(rating) },
          statistics: {
            total_order_reviews: total_order_reviews,
            total_dish_ratings: total_dish_ratings,
            total_drink_ratings: total_drink_ratings,
            average_order_rating: avg_order_rating,
            average_dish_rating: avg_dish_rating,
            average_drink_rating: avg_drink_rating,
            overall_average: calculate_overall_average(avg_order_rating, avg_dish_rating, avg_drink_rating, total_order_reviews, total_dish_ratings, total_drink_ratings)
          }
        }, status: :ok
      rescue => e
        Rails.logger.error "[EstablishmentsRatingsController] Erro: #{e.class} - #{e.message}"
        render json: {
          error: 'Erro ao buscar avaliações',
          message: e.message
        }, status: :internal_server_error
      end

      private

      def skip_session
        request.session_options[:skip] = true if request.session_options
      rescue => e
        Rails.logger.warn "Erro ao pular sessão: #{e.message}"
      end

      def set_establishment
        @establishment = Establishment.find_by!(code: params[:establishment_code])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
      end

      def format_review(review)
        {
          id: review.id,
          type: 'order_review',
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at.iso8601,
          user: {
            id: review.user.id,
            name: review.user.name,
            email: review.user.email
          },
          order: {
            id: review.order.id,
            code: review.order.code,
            total_price: review.order.total_price.to_f,
            status: review.order.status
          }
        }
      end

      def format_rating(rating)
        {
          id: rating.id,
          type: rating.dish_id ? 'dish_rating' : 'drink_rating',
          rating: rating.rating,
          comment: rating.comment,
          created_at: rating.created_at.iso8601,
          user: {
            id: rating.user.id,
            name: rating.user.name,
            email: rating.user.email
          },
          item: rating.dish ? {
            id: rating.dish.id,
            name: rating.dish.name,
            type: 'dish'
          } : {
            id: rating.drink.id,
            name: rating.drink.name,
            type: 'drink'
          }
        }
      end

      def calculate_overall_average(avg_order, avg_dish, avg_drink, count_order, count_dish, count_drink)
        total_count = count_order + count_dish + count_drink
        return 0 if total_count == 0

        weighted_sum = (avg_order * count_order) + (avg_dish * count_dish) + (avg_drink * count_drink)
        (weighted_sum / total_count).round(2)
      end
    end
  end
end
