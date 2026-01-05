# Concern for managing current order
module CurrentOrderHelper
  extend ActiveSupport::Concern

  included do
    helper_method :current_order
  end

  private

  def current_order
    return nil unless current_user&.establishment
    @current_order ||= Order.find_by(establishment: current_user.establishment, status: 'draft')
  end

  def create_current_order
    if current_user && current_user.establishment && !current_order
      @current_order ||= Order.create(establishment: current_user.establishment, status: 'draft')
    end
  end
end

