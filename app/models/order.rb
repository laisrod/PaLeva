class Order < ApplicationRecord
    belongs_to :establishment
    has_many :order_menu_items, dependent: :destroy
    has_many :menu_items, through: :order_menu_items
    before_create :generate_code
    
    enum status: {
      draft: 'draft',
      pending: 'pending',
      confirmed: 'confirmed',
      preparing: 'preparing',
      ready: 'ready',
      delivered: 'delivered',
      cancelled: 'cancelled'
    }
  private

  def generate_code
    new_code = SecureRandom.hex(8)
    Order.where(code: new_code).exists? ? generate_code : self.code = new_code
  end
end