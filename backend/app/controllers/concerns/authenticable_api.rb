# Concern for API authentication via token
module AuthenticableApi
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_api_user!
  end

  private

  def authenticate_api_user!
    token = extract_token_from_header
    
    if token.blank?
      render json: { error: 'Token não fornecido' }, status: :unauthorized
      return
    end

    @current_user = find_user_from_token(token)
    
    unless @current_user
      render json: { error: 'Token inválido ou expirado' }, status: :unauthorized
    end
  end

  def current_api_user
    @current_user
  end

  def extract_token_from_header
    auth_header = request.headers['Authorization']
    return nil unless auth_header

    # Suporta tanto "Bearer token" quanto apenas "token"
    auth_header.split(' ').last
  end

  def find_user_from_token(token)
    payload = JsonWebToken.decode(token)
    User.find_by(id: payload[:user_id])
  rescue JsonWebToken::DecodeError
    nil
  end
end

