class Order < ApplicationRecord
  belongs_to :establishment
  has_many :order_menu_items, dependent: :destroy
  has_many :menu_items, through: :order_menu_items
  before_create :generate_code
  before_save :reset_timestamps
  before_save :update_total_price
  
  enum status: {
    draft: 'draft',
    pending: 'pending',
    confirmed: 'confirmed',
    preparing: 'preparing',
    ready: 'ready',
    delivered: 'delivered',
    cancelled: 'cancelled'
  }
  
  def update_total_price
    if status == 'draft'
      self.total_price = order_menu_items.sum { |order_item| order_item.portion.price * order_item.quantity }
    end
  end
  
  private
  
  def reset_timestamps
    if status_changed? && status_was == 'draft' && status != 'draft'
      self.created_at = DateTime.now
      self.updated_at = DateTime.now
    end
  end

  def generate_code
    new_code = SecureRandom.hex(8)
    Order.where(code: new_code).exists? ? generate_code : self.code = new_code
  end
end