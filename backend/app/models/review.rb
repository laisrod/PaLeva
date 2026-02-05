class Review < ApplicationRecord
  belongs_to :order
  belongs_to :user

  validates :rating, presence: true, inclusion: { in: 1..5 }
  validates :user_id, uniqueness: { scope: :order_id, message: 'já avaliou este pedido' }
  
  scope :recent, -> { order(created_at: :desc) }
  
  def self.average_rating_for_order(order_id)
    where(order_id: order_id).average(:rating)&.round(2) || 0
  end
end
