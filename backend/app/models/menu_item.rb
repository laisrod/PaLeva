class MenuItem < ApplicationRecord
  belongs_to :menu
  belongs_to :drink, optional: true
  belongs_to :dish, optional: true
  has_many :order_menu_items, dependent: :destroy
  has_many :orders, through: :order_menu_items
  has_many :menu_item_portions, dependent: :destroy
  has_many :portions, through: :menu_item_portions

  validate :dish_or_drink_present

  private

  def dish_or_drink_present
    if dish_id.blank? && drink_id.blank?
      errors.add(:base, 'Deve ter um prato ou uma bebida')
    end
  end
end