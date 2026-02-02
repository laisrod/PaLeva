class MenuItemPortion < ApplicationRecord
  belongs_to :menu_item
  belongs_to :portion
end
