module Api
  module V1
    class UsersController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :skip_session
      
      def create
        user_params_hash = user_params.to_h
        Rails.logger.info "[UsersController] Parâmetros recebidos: #{user_params_hash.inspect}"
        
        # Converter role para boolean se necessário
        if user_params_hash.key?('role')
          # Se role foi enviado (mesmo que seja false), usar o valor enviado
          role_value = user_params_hash['role']
          Rails.logger.info "[UsersController] Role recebido: #{role_value.inspect} (#{role_value.class})"
          
          # Converter para boolean - Rails pode receber como string "false" ou "true"
          case role_value
          when true, 'true', '1', 1
            user_params_hash['role'] = true
          when false, 'false', '0', 0, nil
            user_params_hash['role'] = false
          else
            # Tentar converter usando ActiveModel::Type::Boolean
            user_params_hash['role'] = ActiveModel::Type::Boolean.new.cast(role_value)
          end
        else
          # Define role como true (owner) por padrão se não foi enviado
          user_params_hash['role'] = true
          Rails.logger.info "[UsersController] Role não foi enviado, definindo como true (owner) por padrão"
        end
        
        Rails.logger.info "[UsersController] Role final antes de criar usuário: #{user_params_hash['role'].inspect} (#{user_params_hash['role'].class})"
        
        @user = User.new(user_params_hash)
        
        if @user.save
          # Não usar session em API - pode causar problemas no Render
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
        Rails.logger.error "[UsersController] Parâmetros faltando: #{e.param}"
        render json: {
          status: :bad_request,
          error: ["Parâmetros faltando: #{e.param}"]
        }, status: :bad_request
      rescue => e
        Rails.logger.error "[UsersController] Erro ao criar usuário: #{e.class} - #{e.message}"
        Rails.logger.error "[UsersController] Backtrace: #{e.backtrace.first(10).join("\n")}"
        render json: {
          status: :internal_server_error,
          error: ['Erro interno do servidor']
        }, status: :internal_server_error
      end

      private
      
      def skip_session
        request.session_options[:skip] = true
      end
      
      def user_params
        params.require(:user).permit(:name, :email, :last_name, :cpf, :password, :password_confirmation, :role)
      end
    end
  end
end
