class Order < ApplicationRecord
  belongs_to :establishment
  has_many :order_menu_items, dependent: :destroy
  has_many :menu_items, through: :order_menu_items
  before_create :generate_code
  before_save :reset_timestamps
  before_save :update_total_price

  validates :customer_cpf, :customer_email, presence: true, on: :update
  # validates :customer_cpf, format: { with: /\A\d{3}\.\d{3}\.\d{3}-\d{2}\z/, message: 'inválido' }, if: :customer_cpf?

  
  enum status: {
    draft: 'draft',
    pending: 'pending',
    preparing: 'preparing',
    ready: 'ready',
    delivered: 'delivered',
    cancelled: 'cancelled'
  }
  
  def next_status(cancel = false)
    return 'cancelled' if cancel
    case status
    when 'draft' then 'pending'
    when 'pending' then 'preparing'
    when 'preparing' then 'ready'
    when 'ready' then 'delivered'
    end
  end

  def can_progress?
    !['delivered', 'cancelled'].include?(status)
  end
  
  def update_total_price
    self.total_price = order_menu_items.sum { |order_item| order_item.portion.price * order_item.quantity }
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