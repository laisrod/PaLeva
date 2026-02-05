# Concern para broadcast de atualizações de pedidos via Action Cable
module OrderBroadcastable
  extend ActiveSupport::Concern

  included do
    after_create :broadcast_order_created, if: :should_broadcast_creation?
    after_update :broadcast_order_updated, if: :should_broadcast_update?
  end

  private

  def broadcast_order_created
    broadcast_order('order_created')
  end

  def broadcast_order_updated
    if status_changed?
      # Se foi cancelado, enviar notificação especial
      if status == 'cancelled'
        broadcast_order('order_cancelled')
      else
        broadcast_order('order_status_changed')
      end
    elsif saved_change_to_total_price? || order_menu_items.any? { |item| item.saved_changes? }
      broadcast_order('order_updated')
    end
  end

  def should_broadcast_creation?
    # Apenas fazer broadcast quando o pedido não é draft (já confirmado)
    status != 'draft'
  end

  def should_broadcast_update?
    # Fazer broadcast quando status muda ou quando pedido sai de draft
    status_changed? || (status_was == 'draft' && status != 'draft')
  end

  def broadcast_order(event_type)
    return unless establishment&.code

    order_data = format_order_for_broadcast
    
    # Broadcast para o canal de pedidos do estabelecimento
    ActionCable.server.broadcast(
      "orders:#{establishment.code}",
      {
        type: event_type,
        order: order_data,
        timestamp: Time.current.iso8601
      }
    )

    # Enviar notificações para o owner do estabelecimento
    send_notification(event_type, order_data)

    Rails.logger.info "[OrderBroadcast] Broadcasted #{event_type} for order #{code} to orders:#{establishment.code}"
  end

  def send_notification(event_type, order_data)
    return unless establishment&.user

    notification_data = build_notification(event_type, order_data)
    
    # Enviar notificação para o owner
    owner_id = establishment.user.id
    ActionCable.server.broadcast(
      "notifications:#{owner_id}",
      notification_data
    )
    Rails.logger.info "[Notification] Sent #{event_type} notification to owner (user_id: #{owner_id}) for order #{code}"

    # Se o pedido tem um usuário associado (cliente), enviar notificação também
    if user.present? && user.id != establishment.user.id
      ActionCable.server.broadcast(
        "notifications:#{user.id}",
        notification_data
      )
      Rails.logger.info "[Notification] Sent #{event_type} notification to client (user_id: #{user.id}) for order #{code}"
    end
  end

  def build_notification(event_type, order_data)
    case event_type
    when 'order_created'
      {
        type: 'info',
        title: 'Novo Pedido Recebido',
        message: "Pedido ##{code} foi criado. Total: R$ #{sprintf('%.2f', total_price || 0)}",
        order_id: id,
        order_code: code,
        timestamp: Time.current.iso8601
      }
    when 'order_status_changed'
      notification = {
        type: 'info',
        title: 'Status do Pedido Atualizado',
        message: "Pedido ##{code} mudou para: #{status_label}",
        order_id: id,
        order_code: code,
        timestamp: Time.current.iso8601
      }
      
      # Notificação especial quando pedido está pronto
      if status == 'ready'
        notification[:type] = 'success'
        notification[:title] = 'Pedido Pronto!'
        notification[:message] = "Seu pedido ##{code} está pronto para retirada!"
      end
      
      notification
    when 'order_cancelled'
      {
        type: 'error',
        title: 'Pedido Cancelado',
        message: "Pedido ##{code} foi cancelado#{cancellation_reason.present? ? ": #{cancellation_reason}" : ''}",
        order_id: id,
        order_code: code,
        timestamp: Time.current.iso8601
      }
    when 'order_updated'
      {
        type: 'info',
        title: 'Pedido Atualizado',
        message: "Pedido ##{code} foi atualizado",
        order_id: id,
        order_code: code,
        timestamp: Time.current.iso8601
      }
    else
      {
        type: 'info',
        title: 'Atualização de Pedido',
        message: "Pedido ##{code} foi atualizado",
        order_id: id,
        order_code: code,
        timestamp: Time.current.iso8601
      }
    end
  end

  def status_label
    status_map = {
      'draft' => 'Rascunho',
      'pending' => 'Pendente',
      'preparing' => 'Preparando',
      'ready' => 'Pronto',
      'delivered' => 'Entregue',
      'cancelled' => 'Cancelado'
    }
    status_map[status] || status
  end

  def format_order_for_broadcast
    {
      id: id,
      code: code,
      status: status,
      total_price: (total_price || 0).to_f,
      customer_name: customer_name,
      customer_email: customer_email,
      customer_phone: customer_phone,
      customer_cpf: customer_cpf,
      created_at: created_at&.iso8601,
      updated_at: updated_at&.iso8601,
      order_menu_items: order_menu_items.map do |item|
        {
          id: item.id,
          quantity: item.quantity,
          menu_id: item.menu_id,
          menu_item_id: item.menu_item_id,
          portion_id: item.portion_id,
          menu: item.menu ? {
            id: item.menu.id,
            name: item.menu.name,
            price: item.menu.price.to_f
          } : nil,
          portion: item.portion ? {
            id: item.portion.id,
            description: item.portion.description,
            price: item.portion.price.to_f
          } : nil,
          menu_item: item.menu_item ? {
            id: item.menu_item.id,
            name: item.menu_item.dish&.name || item.menu_item.drink&.name
          } : nil
        }
      end
    }
  end
end
