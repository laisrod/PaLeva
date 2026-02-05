require 'devise'

class ApplicationController < ActionController::Base
  include CurrentOrderHelper

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_active_storage_url_options
  before_action :create_current_order, unless: -> { request.path.start_with?('/api/') }

  # Tratamento de exceções para APIs
  rescue_from ActionController::InvalidAuthenticityToken, with: :handle_api_exception

  private

  def handle_api_exception(exception)
    if request.path.start_with?('/api/')
      render json: {
        status: :unprocessable_entity,
        error: [exception.message]
      }, status: :unprocessable_entity
    else
      raise exception
    end
  end

  def after_sign_up_path_for(resource)
    Rails.logger.debug ">>> after_sign_up_path_for called for #{resource.inspect}"
    new_establishment_path
  end

  def after_sign_in_path_for(resource)
    if resource.establishment.nil?
      new_establishment_path
    else
      super
    end
  end

  def check_establishment!
    if current_user && current_user.establishment.nil?
      redirect_to new_establishment_path
    end
  end

  private

  def create_current_order
    return if request.path.start_with?('/api/')
    
    begin
      if current_user && current_user.establishment && !current_order
        @current_order ||= Order.create(establishment: current_user.establishment, status: 'draft')
      end
    rescue => e
      Rails.logger.error "Erro ao criar pedido atual: #{e.message}"
      # Não bloqueia a requisição se houver erro ao criar o pedido
    end
  end

  def set_active_storage_url_options
    return if request.path.start_with?('/api/')
    
    begin
      ActiveStorage::Current.url_options = { host: request.base_url }
    rescue => e
      Rails.logger.warn "Erro ao configurar ActiveStorage URL: #{e.message}"
      # Não bloqueia a requisição se houver erro
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :cpf, :last_name, :role])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :cpf, :last_name, :role])
  end
end
