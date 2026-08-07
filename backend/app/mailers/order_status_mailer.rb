class OrderStatusMailer < ApplicationMailer
  STATUS_LABELS = {
    'pending'   => 'Recebido',
    'preparing' => 'Em Preparação',
    'ready'     => 'Pronto para Retirada',
    'delivered' => 'Entregue',
    'cancelled' => 'Cancelado'
  }.freeze

  def status_changed(order)
    @order = order
    @establishment = order.establishment
    @status_label = STATUS_LABELS.fetch(order.status, order.status)

    mail(
      to: order.customer_email,
      subject: "Pedido ##{order.id} — #{@status_label}"
    )
  end
end
