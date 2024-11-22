module Api
  module V1
    class SessionsController < ApplicationController
      def create
        @user = User.find_by(email: session_params[:email])
        if @user && @user.valid_password?(session_params[:password])
          session[:user_id] = @user.id
          render json: {
            status: 200,
            user: @user
          }
        else
          render json: { 
            status: 401, 
            error: "Email ou senha inválidos"
          }
        end
      end

      def is_signed_in?
        if current_user
          render json: {
            status: 200,
            signed_in: true,
            user: current_user
          }
        else
          render json: {
            status: 401,
            signed_in: false
          }
        end
      end

      def destroy
        session.delete :user_id
        render json: {
          status: 200,
          signed_out: true
        }
      end

      private

      def current_user
        @current_user ||= User.find(session[:user_id]) if session[:user_id]
      end

      def session_params
        params.require(:user).permit(:email, :password)
      end
    end
  end
end
