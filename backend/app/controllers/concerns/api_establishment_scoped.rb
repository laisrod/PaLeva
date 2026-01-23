# Concern for API controllers to scope by establishment code
module ApiEstablishmentScoped
  extend ActiveSupport::Concern

  included do
    before_action :set_establishment_by_code
  end

  private

  def set_establishment_by_code
    establishment_code = params[:establishment_code] || params[:code]
    @establishment = Establishment.find_by!(code: establishment_code)
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Establishment not found' }, status: :not_found
  end
end

