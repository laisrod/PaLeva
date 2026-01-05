class MenuItem < ApplicationRecord
  belongs_to :menu
  belongs_to :drink, optional: true
  belongs_to :dish, optional: true
  has_many :order_menu_items, dependent: :destroy
  has_many :orders, through: :order_menu_items
end