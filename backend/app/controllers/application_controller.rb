class ApplicationController < ActionController::Base
  include CurrentOrderHelper
  include Authenticable
  include EstablishmentRequired

  before_action :set_active_storage_url_options
  before_action :create_current_order

  rescue_from ActionController::InvalidAuthenticityToken, with: :handle_api_exception

  private

  def handle_api_exception(exception)
    if request.path.start_with?('/api/') || request.format.json?
      render json: {
        status: :unprocessable_entity,
        error: [exception.message]
      }, status: :unprocessable_entity
    else
      raise exception
    end
  end

  def create_current_order
    if current_user && current_user.establishment && !current_order
      @current_order ||= Order.create(establishment: current_user.establishment, status: 'draft')
    end
  end

  def set_active_storage_url_options
    ActiveStorage::Current.url_options = { host: request.base_url }
  end
end
