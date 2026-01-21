module Authorizable #verificação de permissões (owner/employee)
  extend ActiveSupport::Concern

  private

  def authorize_owner!
    # Verificar se há usuário e estabelecimento
    unless current_user && @establishment
      if request.format.json? || request.path.start_with?('/api/')
        render json: { error: 'Não autorizado' }, status: :unauthorized
      else
        redirect_to root_path, alert: 'Não autorizado.'
      end
      return
    end
    
    # Verificar se o usuário é dono (role == true) e se é o dono do estabelecimento
    is_owner = current_user.role == true
    is_establishment_owner = current_user == @establishment.user
    
    unless is_owner && is_establishment_owner
      Rails.logger.warn "Autorização negada: user_id=#{current_user.id}, role=#{current_user.role}, establishment_user_id=#{@establishment.user_id}"
      if request.format.json? || request.path.start_with?('/api/')
        render json: { error: 'Acesso não autorizado' }, status: :forbidden
      else
        redirect_to root_path, alert: 'Acesso não autorizado. Apenas o dono do estabelecimento pode realizar esta ação.'
      end
    end
  end

  def authorize_owner_or_employee!
    unless current_user && (current_user == @establishment.user || @establishment.user == current_user.establishment&.user)
      if request.format.json? || request.path.start_with?('/api/')
        render json: { error: 'Acesso não autorizado' }, status: :forbidden
      else
        redirect_to root_path, alert: 'Acesso não autorizado'
      end
    end
  end
end
