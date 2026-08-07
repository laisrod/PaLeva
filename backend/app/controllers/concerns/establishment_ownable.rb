module EstablishmentOwnable
  extend ActiveSupport::Concern

  private

  def authorize_establishment_owner!
    return if @establishment && current_api_user && @establishment.user_id == current_api_user.id

    render json: { error: "Não autorizado" }, status: :forbidden
  end
end
