class NotificationsChannel < ApplicationCable::Channel
  def subscribed
    # Verificar se o usuário está autenticado
    unless current_user
      Rails.logger.warn "[NotificationsChannel] Rejected: No current_user"
      reject
      return
    end

    # Inscrever no stream de notificações do usuário
    stream_name = "notifications:#{current_user.id}"
    stream_from stream_name
    
    Rails.logger.info "[NotificationsChannel] User #{current_user.email} (ID: #{current_user.id}) subscribed to #{stream_name}"
    
    # Enviar uma notificação de teste para confirmar a conexão
    ActionCable.server.broadcast(
      stream_name,
      {
        type: 'info',
        title: 'Sistema de Notificações',
        message: 'Você está conectado e receberá notificações em tempo real!',
        timestamp: Time.current.iso8601
      }
    )
  end

  def unsubscribed
    if current_user
      Rails.logger.info "[NotificationsChannel] User #{current_user.email} unsubscribed"
    end
  end
end
