module Authenticable #autenticação via firebase
  extend ActiveSupport::Concern

  included do
    helper_method :current_user
  end

  private

  def authenticate_user!
    unless current_user
      if request.format.json? || request.path.start_with?('/api/')
        render json: { error: 'Não autorizado' }, status: :unauthorized
      else
        # Para requisições HTML, redirecionar para o frontend para fazer login
        # Usar redirect_to com status 302 explícito e allow_other_host
        redirect_to 'http://localhost:5176/login', allow_other_host: true, status: :found
      end
    end
  end

  def current_user
    @current_user ||= authenticate_user_from_firebase_token
  end

  def authenticate_user_from_firebase_token
    token = request.headers['Authorization']&.split&.last
    
    token ||= cookies[:firebase_token]
    
    Rails.logger.debug "Authenticable: Token presente? #{token.present?}"
    Rails.logger.debug "Authenticable: Cookie firebase_token presente? #{cookies[:firebase_token].present?}"
    
    return nil unless token

    firebase_data = FirebaseTokenValidator.validate(token)
    Rails.logger.debug "Authenticable: Firebase data válido? #{firebase_data.present?}"
    
    return nil unless firebase_data

    user = User.find_by(email: firebase_data[:email])
    Rails.logger.debug "Authenticable: Usuário encontrado? #{user.present?}"
    user
  rescue => e
    Rails.logger.error "Erro ao autenticar usuário: #{e.class}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    nil
  end
end
