module Authenticable
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
        render plain: 'Não autorizado', status: :unauthorized
      end
    end
  end

  def current_user
    @current_user ||= authenticate_user_from_firebase_token
  end

  def authenticate_user_from_firebase_token
    token = request.headers['Authorization']&.split&.last
    
    token ||= cookies[:firebase_token]
    
    return nil unless token

    firebase_data = FirebaseTokenValidator.validate(token)
    return nil unless firebase_data

    User.find_by(email: firebase_data[:email])
  rescue => e
    Rails.logger.error "Erro ao autenticar usuário: #{e.class}: #{e.message}"
    nil
  end
end
