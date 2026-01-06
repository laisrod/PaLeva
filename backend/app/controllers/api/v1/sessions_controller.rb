module Api
  module V1
    class SessionsController < ApplicationController
      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      before_action :authenticate_api_user!, only: %i[destroy is_signed_in?]

      def create
        user = User.find_by(email: session_params[:email])

        if user&.valid_password?(session_params[:password])
          user.regenerate_api_token if user.api_token.blank?
          
          # Log para debug
          Rails.logger.info "=== LOGIN DEBUG ==="
          Rails.logger.info "User ID: #{user.id}"
          Rails.logger.info "User role (raw): #{user.role.inspect}"
          Rails.logger.info "User role (class): #{user.role.class}"
          Rails.logger.info "User role (boolean?): #{user.role.is_a?(TrueClass) || user.role.is_a?(FalseClass)}"
          Rails.logger.info "Has establishment: #{user.establishment.present?}"
          Rails.logger.info "Establishment code: #{user.establishment&.code}"
          
          user_data = user.slice(:id, :email, :name, :role)
          user_data[:establishment] = user.establishment&.slice(:id, :code, :name) if user.establishment
          
          Rails.logger.info "User data to return: #{user_data.inspect}"
          Rails.logger.info "==================="
          
          render json: { token: user.api_token, user: user_data }, status: :ok
        else
          render json: { error: 'Email ou senha inválidos' }, status: :unauthorized
        end
      end

      def is_signed_in?
        token = request.headers['Authorization']&.split&.last
        user = User.find_by(api_token: token) if token.present?
        
        if user
          user_data = user.slice(:id, :email, :name, :role)
          user_data[:establishment] = user.establishment&.slice(:id, :code, :name) if user.establishment
          render json: { signed_in: true, user: user_data }, status: :ok
        else
          render json: { signed_in: false }, status: :ok
        end
      end

      def destroy
        current_api_user&.regenerate_api_token
        render json: { signed_out: true }, status: :ok
      end

      private

      def session_params
        params.require(:user).permit(:email, :password)
      end
    end
  end
end
