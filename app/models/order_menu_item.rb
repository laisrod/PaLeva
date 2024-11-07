class OrderMenuItem < ApplicationRecord
  belongs_to :order
  belongs_to :menu_item
  belongs_to :portion
end
