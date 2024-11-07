class MenuItem < ApplicationRecord
  belongs_to :menu
  belongs_to :drink, optional: true
  belongs_to :dish, optional: true
  has_many :order_menu_items, dependent: :destroy
  has_many :orders, through: :order_menu_items

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
end