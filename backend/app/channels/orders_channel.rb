class OrdersChannel < ApplicationCable::Channel
  def subscribed
    # Verificar se o usuário tem um estabelecimento
    establishment = current_user.establishment
    
    return reject unless establishment

    # Inscrever no stream do estabelecimento
    stream_from "orders:#{establishment.code}"
    
    Rails.logger.info "[OrdersChannel] User #{current_user.email} subscribed to orders:#{establishment.code}"
  end

  def unsubscribed
    Rails.logger.info "[OrdersChannel] User #{current_user.email} unsubscribed"
  end
end
