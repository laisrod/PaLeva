class SendOrderStatusJob < ApplicationJob
  queue_as :mailers

  def perform(order_id)
    order = Order.find(order_id)
    return if order.customer_email.blank?

    OrderStatusMailer.status_changed(order).deliver_now
  end
end
