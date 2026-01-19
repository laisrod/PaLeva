module AuthenticableApi
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_api_user!
  end

  private

  def authenticate_api_user!
    token = request.headers['Authorization']&.split&.last
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless token

    firebase_data = FirebaseTokenValidator.validate(token)
    return render json: { error: 'Invalid token' }, status: :unauthorized unless firebase_data

    @current_user = User.find_by(email: firebase_data[:email])
    
    unless @current_user
      render json: { error: 'User not found' }, status: :unauthorized
      return
    end
  end

  def current_api_user
    @current_user
  end
end

