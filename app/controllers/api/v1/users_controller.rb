module Api
  module V1
    class UsersController < ApplicationController
      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      
      # Sempre retornar JSON
      before_action :set_json_format
      before_action :set_cors_headers
      
      rescue_from StandardError, with: :handle_error
      
      def create
        user_data = user_params.to_h
        Rails.logger.info "User data: #{user_data.inspect}"
        
        # Definir role como false por padrão (não é dono)
        user_data[:role] = false
        
        # Formatar CPF no formato esperado: 000.000.000-00
        if user_data[:cpf].present?
          cpf_clean = user_data[:cpf].gsub(/[^0-9]/, '')
          Rails.logger.info "CPF clean: #{cpf_clean}"
          
          if cpf_clean.length == 11
            # Validar CPF antes de formatar
            unless CPF.valid?(cpf_clean)
              Rails.logger.error "CPF inválido: #{cpf_clean}"
              return render json: {
                status: :unprocessable_entity,
                error: ['CPF inválido']
              }, status: :unprocessable_entity
            end
            # Formatar: 000.000.000-00
            user_data[:cpf] = "#{cpf_clean[0..2]}.#{cpf_clean[3..5]}.#{cpf_clean[6..8]}-#{cpf_clean[9..10]}"
            Rails.logger.info "CPF formatted: #{user_data[:cpf]}"
          else
            Rails.logger.error "CPF deve conter 11 dígitos: #{cpf_clean.length}"
            return render json: {
              status: :unprocessable_entity,
              error: ['CPF deve conter 11 dígitos']
            }, status: :unprocessable_entity
          end
        end
        
        Rails.logger.info "Creating user with data: #{user_data.inspect}"
        @user = User.new(user_data)
        
        if @user.save
          Rails.logger.info "User created successfully: #{@user.id}"
          render json: {
            status: :created,
            user: @user.slice(:id, :name, :email)
          }, status: :created
        else 
          Rails.logger.error "User validation errors: #{@user.errors.full_messages.inspect}"
          render json: {
            status: :unprocessable_entity,
            error: @user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private
      
      def set_json_format
        request.format = :json
      end
      
      def set_cors_headers
        headers['Access-Control-Allow-Origin'] = '*'
        headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        headers['Access-Control-Allow-Headers'] = 'Content-Type'
      end
      
      def handle_error(exception)
        Rails.logger.error "=== ERROR creating user ==="
        Rails.logger.error "Error: #{exception.class} - #{exception.message}"
        Rails.logger.error exception.backtrace.join("\n")
        
        render json: {
          status: :internal_server_error,
          error: ["Erro ao criar usuário: #{exception.message}"]
        }, status: :internal_server_error
      end
      
      def user_params
        params.require(:user).permit(:name, :email, :last_name, :cpf, :password, :password_confirmation)
      end
    end
  end
end
