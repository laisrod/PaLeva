class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_active_storage_url_options
  before_action :create_current_order


  def after_sign_up_path_for(resource)
    Rails.logger.debug ">>> after_sign_up_path_for called for #{resource.inspect}"
    new_establishment_path
  end

  def after_sign_in_path_for(resource)
    if resource.establishment.nil?
      new_establishment_path # Redireciona para a página de cadastro do restaurante
    else
      super # Redireciona para a página padrão após login
    end
  end

  def current_order
    @current_order ||= Order.find_by(establishment: current_user.establishment, status: 'draft')
  end
  helper_method :current_order

  private

  def create_current_order
    if current_user && current_user.establishment && !current_order
      @current_order ||= Order.create(establishment: current_user.establishment, status: 'draft')
    end
  end

  def check_establishment!
    if current_user && current_user.establishment.nil?
      redirect_to new_establishment_path
    end
  end

  def set_active_storage_url_options
    ActiveStorage::Current.url_options = { host: request.base_url }
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :cpf, :last_name, :role])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :cpf, :last_name, :role])
  end
end
