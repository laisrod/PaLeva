# Service para gerenciar mudanças de status de pedidos
class OrderStatusService
  def initialize(order)
    @order = order
  end

  def progress!
    return failure('Não é possível alterar o status deste pedido.') unless @order.can_progress?

    new_status = @order.next_status
    if @order.update(status: new_status)
      @order.update_total_price
      success(status_message(new_status), new_status)
    else
      failure(@order.errors.full_messages.join(', '))
    end
  end

  def cancel!(reason = nil)
    if @order.update(status: 'cancelled', cancellation_reason: reason)
      success('Pedido cancelado com sucesso!')
    else
      failure(@order.errors.full_messages.join(', '))
    end
  end

  private

  def success(message, status = nil)
    { success: true, message: message, status: status || @order.status }
  end

  def failure(message)
    { success: false, message: message }
  end

  def status_message(status)
    case status
    when 'pending' then 'Pedido enviado para a cozinha!'
    when 'preparing' then 'Pedido em preparação!'
    when 'ready' then 'Pedido pronto!'
    when 'delivered' then 'Pedido entregue!'
    else 'Status atualizado com sucesso!'
    end
  end
end

