module EstablishmentRequired
  extend ActiveSupport::Concern

  private

  def check_establishment!
    if request.format.json? || request.path.start_with?('/api/')
      unless current_user
        render json: { error: 'Não autorizado' }, status: :unauthorized
        return
      end

      if current_user.establishment.nil?
        render json: { error: 'Estabelecimento não encontrado' }, status: :not_found
        return
      end
    else
      return unless current_user

      if current_user.establishment.nil?
        redirect_to new_establishment_path
      end
    end
  end
end
