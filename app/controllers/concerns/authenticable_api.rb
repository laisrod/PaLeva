# Concern for API authentication via token
module AuthenticableApi
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_api_user!
  end

  private

  def authenticate_api_user!
    token = request.headers['Authorization']&.split&.last
    @current_user = User.find_by(api_token: token)
    return if @current_user

    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

  def current_api_user
    @current_user
  end
end

