class Portion < ApplicationRecord
  belongs_to :drink, optional: true
  belongs_to :dish, optional: true
  has_many :price_histories, dependent: :destroy
  
  scope :current, -> { order(created_at: :desc).first }
  scope :historical, -> { order(price: :desc, created_at: :desc) }
  after_create :create_price_history
  after_update :update_price_history
  private

  def create_price_history
    PriceHistory.create(portion: self, price: price)
  end

  def update_price_history
    PriceHistory.create(portion: self, price: price)
  end
end
