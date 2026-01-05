# Concern for scoping resources by establishment
module EstablishmentScoped
  extend ActiveSupport::Concern

  included do
    before_action :set_establishment
  end

  private

  def set_establishment
    @establishment = Establishment.find(params[:establishment_id])
  rescue ActiveRecord::RecordNotFound
    redirect_to establishments_path, alert: 'Establishment not found'
  end
end

