module Api
  module V1
    class SessionsController < ApplicationController
      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      skip_before_action :set_active_storage_url_options
      before_action :authenticate_api_user!, only: [:destroy]
      before_action :skip_session

      def create
        Rails.logger.info "[SessionsController] Iniciando sign_in com email: #{session_params[:email]}"
        
        user = User.find_by(email: session_params[:email])
        Rails.logger.info "[SessionsController] Usuário encontrado: #{user.present?}"

        if user && user.valid_password?(session_params[:password])
          Rails.logger.info "[SessionsController] Senha válida, formatando dados do usuário"
          user_data = format_user_data(user)
          Rails.logger.info "[SessionsController] Dados formatados com sucesso"
          render json: { token: user.email, user: user_data }, status: :ok
        else
          Rails.logger.warn "[SessionsController] Email ou senha inválidos"
          render json: { error: 'Email ou senha inválidos' }, status: :unauthorized
        end
      rescue ActionController::ParameterMissing => e
        Rails.logger.error "[SessionsController] Parâmetros faltando: #{e.param}"
        render json: {
          status: :bad_request,
          error: ["Parâmetros faltando: #{e.param}"]
        }, status: :bad_request
      rescue => e
        Rails.logger.error "[SessionsController] Erro no sign_in: #{e.class} - #{e.message}"
        Rails.logger.error "[SessionsController] Backtrace: #{e.backtrace.first(10).join("\n")}"
        render json: {
          status: :internal_server_error,
          error: ['Erro interno do servidor']
        }, status: :internal_server_error
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

      def authenticate_api_user!
        email = request.headers['Authorization']&.split&.last
        @current_user = User.find_by(email: email)
        return if @current_user

        render json: { error: 'Unauthorized' }, status: :unauthorized
      end

      def current_api_user
        @current_user
      end

      def skip_session
        request.session_options[:skip] = true if request.session_options
      rescue => e
        Rails.logger.warn "Erro ao pular sessão: #{e.message}"
        # Continua mesmo se houver erro
      end

      def session_params
        params.require(:user).permit(:email, :password)
      end

      def format_user_data(user)
        begin
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
        rescue => e
          Rails.logger.error "[SessionsController] Erro ao formatar dados do usuário: #{e.class} - #{e.message}"
          Rails.logger.error "[SessionsController] Backtrace: #{e.backtrace.first(5).join("\n")}"
          # Retorna dados básicos mesmo se houver erro
          {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        end
      end
    end
  end
end
