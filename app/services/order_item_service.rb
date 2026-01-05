# Service for handling order item operations
class OrderItemService
  def self.add_item(order, params)
    new(order).add_item(params)
  end

  def self.remove_item(order, item_id)
    new(order).remove_item(item_id)
  end

  def initialize(order)
    @order = order
  end

  def add_item(params)
    order_menu_item = @order.order_menu_items.build(params)

    if order_menu_item.save
      @order.update_total_price
      { success: true }
    else
      { success: false, error: order_menu_item.errors.full_messages.join(', ') }
    end
  end

  def remove_item(item_id)
    order_menu_item = @order.order_menu_items.find_by(id: item_id)
    return { success: false, error: 'Item not found' } unless order_menu_item

    if order_menu_item.destroy
      @order.update_total_price
      { success: true }
    else
      { success: false, error: 'Failed to remove item' }
    end
  end
end

