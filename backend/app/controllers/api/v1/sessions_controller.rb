module Api
  module V1
    class SessionsController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :authenticate_api_user!, only: [:destroy]

      # Método create não é mais necessário - autenticação é feita pelo Firebase
      # Mantido apenas para compatibilidade com requisições antigas
      def create
        # Se a requisição vem de /users/sign_in (rota antiga do Devise), retornar erro mais amigável
        if request.path.include?('/users/sign_in')
          render json: { 
            error: 'Este endpoint não é mais suportado. Use Firebase Auth para autenticação.',
            message: 'A autenticação agora é feita através do Firebase. Verifique se o frontend está usando firebaseAuth.signIn() em vez de fazer requisições para este endpoint.'
          }, status: :gone
        else
          render json: { 
            error: 'Use Firebase Auth for authentication. This endpoint is deprecated.' 
          }, status: :method_not_allowed
        end
      end

      def is_signed_in?
        token = request.headers['Authorization']&.split&.last
        
        unless token
          render json: { signed_in: false }, status: :ok
          return
        end

        # Validar token do Firebase
        firebase_data = FirebaseTokenValidator.validate(token)
        
        unless firebase_data
          render json: { signed_in: false }, status: :ok
          return
        end

        # Buscar usuário pelo email do Firebase
        user = User.find_by(email: firebase_data[:email])
        
        if user
          render json: { 
            signed_in: true, 
            user: format_user_data(user)
          }, status: :ok
        else
          render json: { signed_in: false }, status: :ok
        end
      end

      # Endpoint para definir cookie com token Firebase (para requisições HTML)
      def set_cookie
        token = request.headers['Authorization']&.split&.last || params[:token]
        
        unless token
          render json: { error: 'Token não fornecido' }, status: :bad_request
          return
        end

        # Validar token do Firebase
        firebase_data = FirebaseTokenValidator.validate(token)
        
        unless firebase_data
          render json: { error: 'Token inválido' }, status: :unauthorized
          return
        end

        # Definir cookie com o token (válido por 1 hora, mesmo tempo que tokens Firebase)
        cookies[:firebase_token] = {
          value: token,
          expires: 1.hour.from_now,
          httponly: true,
          secure: Rails.env.production?,
          same_site: :lax
        }

        render json: { success: true }, status: :ok
      end

      # Logout é feito no Firebase, mas mantemos o endpoint para compatibilidade
      def destroy
        # Limpar cookie de autenticação
        cookies.delete(:firebase_token)
        render json: { signed_out: true }, status: :ok
      end

      # Endpoint para definir cookie com token Firebase (para requisições HTML)
      def set_cookie
        token = request.headers['Authorization']&.split&.last || params[:token]
        
        unless token
          render json: { error: 'Token não fornecido' }, status: :bad_request
          return
        end

        # Validar token do Firebase
        firebase_data = FirebaseTokenValidator.validate(token)
        
        unless firebase_data
          render json: { error: 'Token inválido' }, status: :unauthorized
          return
        end

        # Definir cookie com o token (válido por 1 hora, mesmo tempo que tokens Firebase)
        cookies[:firebase_token] = {
          value: token,
          expires: 1.hour.from_now,
          httponly: true,
          secure: Rails.env.production?,
          same_site: :lax
        }

        render json: { success: true }, status: :ok
      end

      private

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
