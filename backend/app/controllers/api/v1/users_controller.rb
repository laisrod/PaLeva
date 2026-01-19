module Api
  module V1
    class UsersController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :skip_session
      before_action :validate_firebase_token!, only: [:create]
      
      def create
        firebase_data = @firebase_data
        
        if User.exists?(email: firebase_data[:email])
          render json: {
            status: :unprocessable_entity,
            error: ['Usuário já existe']
          }, status: :unprocessable_entity
          return
        end

        @user = User.new(user_params)
        @user.email = firebase_data[:email] # Garantir que o email vem do Firebase
        # Definir senha aleatória diretamente na coluna (não usamos mais para autenticação)
        # A coluna encrypted_password é NOT NULL, então precisamos de um valor
        require 'bcrypt'
        @user.encrypted_password = BCrypt::Password.create(SecureRandom.hex(32))
        
        @user.role = true unless @user.role.present?
        
        if @user.save
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
      
      def validate_firebase_token!
        token = request.headers['Authorization']&.split&.last
        
        unless token
          Rails.logger.error "Token não fornecido no header Authorization"
          render json: { error: 'Token não fornecido' }, status: :unauthorized
          return
        end

        Rails.logger.info "Validando token Firebase: #{token[0..20]}..."
        begin
          @firebase_data = FirebaseTokenValidator.validate(token)
        rescue => e
          Rails.logger.error "Exceção ao validar token: #{e.class}: #{e.message}"
          Rails.logger.error "Backtrace: #{e.backtrace.first(10).join("\n")}"
          render json: { 
            error: 'Erro ao validar token',
            message: "Erro: #{e.message}. Verifique os logs do servidor."
          }, status: :unauthorized
          return
        end
        
        unless @firebase_data
          Rails.logger.error "Token inválido ou não pôde ser validado"
          Rails.logger.error "Token recebido (primeiros 50 chars): #{token[0..50]}..." if token
          
          # Tentar decodificar sem validar para ver o que tem no token
          debug_info = {}
          begin
            decoded = JWT.decode(token, nil, false)
            payload = decoded[0]
            debug_info = {
              aud: payload['aud'],
              iss: payload['iss'],
              email: payload['email'],
              user_id: payload['user_id'] || payload['sub'],
              exp: payload['exp'],
              iat: payload['iat']
            }
            Rails.logger.error "Conteúdo do token (sem validação): #{debug_info.inspect}"
          rescue => e
            Rails.logger.error "Não foi possível decodificar token nem sem validação: #{e.message}"
            debug_info = { decode_error: e.message }
          end
          
          project_id = ENV['FIREBASE_PROJECT_ID'] || Rails.application.credentials.dig(:firebase, :project_id) || 'palevar'
          
          render json: { 
            error: 'Token inválido',
            message: 'O token do Firebase não pôde ser validado.',
            debug: {
              project_id_expected: project_id,
              token_info: debug_info
            }
          }, status: :unauthorized
          return
        end
        
        Rails.logger.info "Token validado com sucesso para email: #{@firebase_data[:email]}"
      end
      
      def user_params
        params.require(:user).permit(:name, :last_name, :cpf)
      end
    end
  end
end
