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
      broadcast_order('order_status_changed')
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
    
    ActionCable.server.broadcast(
      "orders:#{establishment.code}",
      {
        type: event_type,
        order: order_data,
        timestamp: Time.current.iso8601
      }
    )

    Rails.logger.info "[OrderBroadcast] Broadcasted #{event_type} for order #{code} to orders:#{establishment.code}"
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
