module Api
  module V1
    class UsersController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :skip_session
      
      def create
        @user = User.new(user_params)
        # Define role como true (owner) por padrão para novos usuários
        @user.role = true unless @user.role.present?
        
        if @user.save
          session[:user_id] = @user.id
          render json: {
            status: :created,
            user: @user.as_json(except: [:encrypted_password, :reset_password_token])
          }, status: :created
        else 
          render json: {
            status: :unprocessable_entity,
            error: @user.errors.full_messages.map(&:to_s)
          }, status: :unprocessable_entity
        end
      rescue ActionController::ParameterMissing => e
        render json: {
          status: :bad_request,
          error: ["Parâmetros faltando: #{e.param}"]
        }, status: :bad_request
      end

      private
      
      def skip_session
        request.session_options[:skip] = true
      end
      
      def user_params
        params.require(:user).permit(:name, :email, :last_name, :cpf, :password, :password_confirmation)
      end
    end
  end
end
