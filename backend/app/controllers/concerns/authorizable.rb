module Authorizable #verificação de permissões (owner/employee)
  extend ActiveSupport::Concern

  private

  def authorize_owner!
    unless current_user&.owner? && current_user == @establishment.user
      if request.format.json? || request.path.start_with?('/api/')
            # Bloqueia acesso se não for o dono
        render json: { error: 'Acesso não autorizado' }, status: :forbidden
      else
        redirect_to root_path, alert: 'Acesso não autorizado'
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
