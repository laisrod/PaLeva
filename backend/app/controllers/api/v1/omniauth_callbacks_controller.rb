require 'cgi'

module Api
  module V1
    class OmniauthCallbacksController < ApplicationController
      skip_before_action :verify_authenticity_token
      skip_before_action :set_active_storage_url_options
      # OAuth implementado manualmente - não precisa de sessão

      # Action para iniciar o fluxo OAuth do Google
      def initiate
        # Redirecionar manualmente para o Google OAuth (sem depender do middleware)
        client_id = ENV['GOOGLE_CLIENT_ID'] || ''
        redirect_uri = "#{request.base_url}/api/v1/login/google_oauth2/callback"
        scope = 'email profile'
        
        google_auth_url = "https://accounts.google.com/o/oauth2/auth?" +
          "client_id=#{CGI.escape(client_id)}&" +
          "redirect_uri=#{CGI.escape(redirect_uri)}&" +
          "response_type=code&" +
          "scope=#{CGI.escape(scope)}&" +
          "access_type=offline&" +
          "prompt=select_account"
        
        redirect_to google_auth_url, allow_other_host: true
      end

      def google_oauth2
        # Processar callback manualmente (sem middleware OmniAuth)
        code = params[:code]
        
        unless code
          frontend_url = ENV['FRONTEND_URL'] || 'http://localhost:5177'
          redirect_url = "#{frontend_url}/auth/callback?error=#{CGI.escape('Código de autorização não fornecido')}"
          redirect_to redirect_url, allow_other_host: true
          return
        end

        # Trocar código por token de acesso
        auth_data = exchange_code_for_token(code)
        
        unless auth_data
          frontend_url = ENV['FRONTEND_URL'] || 'http://localhost:5177'
          redirect_url = "#{frontend_url}/auth/callback?error=#{CGI.escape('Falha ao obter token de acesso')}"
          redirect_to redirect_url, allow_other_host: true
          return
        end

        # Buscar dados do usuário do Google
        user_info = fetch_user_info(auth_data['access_token'])
        
        unless user_info
          frontend_url = ENV['FRONTEND_URL'] || 'http://localhost:5177'
          redirect_url = "#{frontend_url}/auth/callback?error=#{CGI.escape('Falha ao obter dados do usuário')}"
          redirect_to redirect_url, allow_other_host: true
          return
        end

        # Criar ou atualizar usuário
        user = find_or_create_user_from_google_data(user_info, auth_data)
        
        if user.persisted? && user.valid?
          token = generate_jwt_token(user)
          user_data = format_user_data(user)
          
          # Redirecionar para o frontend com os dados na URL
          require 'cgi' unless defined?(CGI)
          frontend_url = ENV['FRONTEND_URL'] || 'http://localhost:5177'
          redirect_url = "#{frontend_url}/auth/callback?token=#{CGI.escape(token)}&user=#{CGI.escape(user_data.to_json)}"
          
          redirect_to redirect_url, allow_other_host: true
        else
          # Redirecionar para o frontend com erro
          require 'cgi' unless defined?(CGI)
          frontend_url = ENV['FRONTEND_URL'] || 'http://localhost:5177'
          error_message = user.errors.full_messages.join(', ')
          redirect_url = "#{frontend_url}/auth/callback?error=#{CGI.escape(error_message)}"
          
          redirect_to redirect_url, allow_other_host: true
        end
      rescue => e
        Rails.logger.error "[OmniauthCallbacksController] Erro: #{e.class} - #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        render json: {
          error: 'Erro interno do servidor',
          message: e.message
        }, status: :internal_server_error
      end

      def failure
        render json: {
          error: 'Falha na autenticação OAuth',
          message: params[:message] || 'Erro desconhecido'
        }, status: :unauthorized
      end

      private

  
      def generate_jwt_token(user)
        payload = {
          user_id: user.id,
          email: user.email,
          exp: 24.hours.from_now.to_i
        }
        JWT.encode(payload, ENV['JWT_SECRET'] || Rails.application.secrets.secret_key_base, 'HS256')
      end

      def format_user_data(user)
        {
          id: user.id,
          email: user.email,
          name: user.name,
          last_name: user.last_name,
          role: user.role,
          provider: user.provider,
          has_establishment: user.has_establishment?,
          establishment_code: user.establishment&.code
        }
      end

      def exchange_code_for_token(code)
        require 'net/http'
        require 'json'
        
        uri = URI('https://oauth2.googleapis.com/token')
        res = Net::HTTP.post_form(uri,
          client_id: ENV['GOOGLE_CLIENT_ID'],
          client_secret: ENV['GOOGLE_CLIENT_SECRET'],
          code: code,
          redirect_uri: "#{request.base_url}/api/v1/login/google_oauth2/callback",
          grant_type: 'authorization_code'
        )
        
        if res.is_a?(Net::HTTPSuccess)
          JSON.parse(res.body)
        else
          Rails.logger.error "[OmniauthCallbacksController#exchange_code_for_token] Erro: #{res.code} - #{res.body}"
          nil
        end
      rescue => e
        Rails.logger.error "[OmniauthCallbacksController#exchange_code_for_token] Erro: #{e.class} - #{e.message}"
        nil
      end

      def fetch_user_info(access_token)
        require 'net/http'
        require 'json'
        
        uri = URI("https://www.googleapis.com/oauth2/v3/userinfo?access_token=#{access_token}")
        res = Net::HTTP.get_response(uri)
        
        if res.is_a?(Net::HTTPSuccess)
          JSON.parse(res.body)
        else
          Rails.logger.error "[OmniauthCallbacksController#fetch_user_info] Erro: #{res.code} - #{res.body}"
          nil
        end
      rescue => e
        Rails.logger.error "[OmniauthCallbacksController#fetch_user_info] Erro: #{e.class} - #{e.message}"
        nil
      end

      def find_or_create_user_from_google_data(user_info, auth_data)
        user = User.find_by(provider: 'google_oauth2', uid: user_info['sub'])
        
        if user
          # Atualizar dados do usuário existente
          user.update_google_oauth_data(user_info)
          user
        else
          # Verificar se já existe usuário com mesmo email
          existing_user = User.find_by(email: user_info['email'])
          
          if existing_user
            # Vincular OAuth a conta existente
            existing_user.update(
              provider: 'google_oauth2',
              uid: user_info['sub']
            )
            existing_user.update_google_oauth_data(user_info)
            existing_user
          else
            # Criar novo usuário usando o método do modelo
            User.from_google_oauth(user_info)
          end
        end
      end
    end
  end
end
