class Rating < ApplicationRecord
  belongs_to :dish, optional: true
  belongs_to :drink, optional: true
  belongs_to :user

  validates :rating, presence: true, inclusion: { in: 1..5 }
  validate :dish_or_drink_present
  
  scope :recent, -> { order(created_at: :desc) }
  
  def self.average_rating_for_dish(dish_id)
    where(dish_id: dish_id).average(:rating)&.round(2) || 0
  end
  
  def self.average_rating_for_drink(drink_id)
    where(drink_id: drink_id).average(:rating)&.round(2) || 0
  end
  
  private
  
  def dish_or_drink_present
    if dish_id.blank? && drink_id.blank?
      errors.add(:base, 'Deve ter um prato ou uma bebida')
    end
    
    if dish_id.present? && drink_id.present?
      errors.add(:base, 'Não pode ter prato e bebida ao mesmo tempo')
    end
  end
end
