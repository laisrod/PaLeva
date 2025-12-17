module Api
  module V1
    class SessionsController < ApplicationController
      before_action :authenticate_api_user!, only: %i[destroy is_signed_in?]

      def create
        user = User.find_by(email: session_params[:email])

        if user&.valid_password?(session_params[:password])
          user.regenerate_api_token if user.api_token.blank?
          render json: { token: user.api_token, user: user.slice(:id, :email, :name) }, status: :ok
        else
          render json: { error: 'Email ou senha inválidos' }, status: :unauthorized
        end
      end

      def is_signed_in?
        if current_api_user
          render json: { signed_in: true, user: current_api_user.slice(:id, :email, :name) }, status: :ok
        else
          render json: { signed_in: false }, status: :unauthorized
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
