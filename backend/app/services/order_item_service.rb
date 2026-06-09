# Service para gerenciar itens de pedidos
class OrderItemService
  def initialize(order)
    @order = order
  end

  def add_item(portion_id:, menu_item_id:, quantity:)
    @order.with_lock do
      portion = Portion.find_by(id: portion_id)
      menu_item = MenuItem.find_by(id: menu_item_id)

      return failure('Porção não encontrada') unless portion
      return failure('Item do cardápio não encontrado') unless menu_item

      order_menu_item = @order.order_menu_items.build(
        portion: portion,
        menu_item: menu_item,
        quantity: quantity
      )

      if order_menu_item.save
        @order.reload
        success('Item adicionado com sucesso!', order_menu_item)
      else
        failure(order_menu_item.errors.full_messages.join(', '))
      end
    end
  rescue ActiveRecord::LockWaitTimeout
    failure('Pedido está sendo modificado. Tente novamente em instantes.')
  end

  def remove_item(item_id)
    @order.with_lock do
      order_menu_item = @order.order_menu_items.find_by(id: item_id)

      return failure('Item não encontrado') unless order_menu_item

      if order_menu_item.destroy
        @order.reload
        success('Item removido com sucesso!')
      else
        failure('Não foi possível remover o item')
      end
    end
  rescue ActiveRecord::LockWaitTimeout
    failure('Pedido está sendo modificado. Tente novamente em instantes.')
  end

  private

  def success(message, order_menu_item = nil)
    { success: true, message: message, order_menu_item: order_menu_item }
  end

  def failure(message)
    { success: false, message: message }
  end
end

