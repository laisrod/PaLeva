module Api
  module V1
    class SessionsController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :authenticate_api_user!, only: [:destroy]

      def create
        user = User.find_by(email: session_params[:email])

        if user.valid_password?(session_params[:password])
          # user.regenerate_api_token if user.api_token.blank?
          render json: { token: user.email, user: format_user_data(user) }, status: :ok
        else
          render json: { error: 'Email ou senha inválidos' }, status: :unauthorized
        end
      rescue ActionController::ParameterMissing => e
        render json: {
          status: :bad_request,
          error: ["Parâmetros faltando: #{e.param}"]
        }, status: :bad_request
      end

      def is_signed_in?
        email = request.headers['Authorization']&.split&.last
        user = email ? User.find_by(email: email) : nil
        
        if user
          render json: { 
            signed_in: true, 
            user: format_user_data(user)
          }, status: :ok
        else
          render json: { signed_in: false }, status: :ok
        end
      end

      def destroy
        current_api_user
        render json: { signed_out: true }, status: :ok
      end

      private

      def session_params
        params.require(:user).permit(:email, :password)
      end

      def format_user_data(user)
        user_data = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }

        if user.establishment.present?
          user_data[:establishment] = {
            id: user.establishment.id,
            code: user.establishment.code,
            name: user.establishment.name
          }
        end

        user_data
      end
    end
  end
end
