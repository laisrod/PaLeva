# Service for handling order status changes
class OrderStatusService
  def initialize(order)
    @order = order
  end

  def progress!
    return error_result('Order cannot progress') unless @order.can_progress?

    next_status = @order.next_status
    if @order.update(status: next_status)
      @order.update_total_price
      success_result(next_status)
    else
      error_result(@order.errors.full_messages.join(', '))
    end
  end

  def cancel!(cancellation_reason = nil)
    return error_result('Order cannot be cancelled') unless @order.can_progress?

    if @order.update(status: 'cancelled', cancellation_reason: cancellation_reason)
      success_result('cancelled', 'Order cancelled successfully')
    else
      error_result(@order.errors.full_messages.join(', '))
    end
  end

  private

  def success_result(status, message = nil)
    {
      success: true,
      status: status,
      notice: message || status_message(status)
    }
  end

  def error_result(message)
    {
      success: false,
      message: message
    }
  end

  def status_message(status)
    case status
    when 'pending' then 'Pedido enviado para a cozinha!'
    when 'preparing' then 'Pedido em preparação!'
    when 'ready' then 'Pedido pronto!'
    when 'delivered' then 'Pedido entregue!'
    when 'cancelled' then 'Pedido cancelado com sucesso!'
    else 'Status atualizado com sucesso'
    end
  end
end

