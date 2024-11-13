class OrderMenuItem < ApplicationRecord
  belongs_to :order
  belongs_to :menu_item
  belongs_to :portion

  validates :portion, presence: { message: 'Não é possível adicionar um item sem porção' }

  after_create :update_order_total_price
  after_destroy :update_order_total_price

  private
  
  def update_order_total_price
    order.update_total_price
    order.save
  end
end
