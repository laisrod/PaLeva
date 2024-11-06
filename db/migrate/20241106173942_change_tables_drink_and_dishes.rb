class ChangeTablesDrinkAndDishes < ActiveRecord::Migration[7.2]
  def change
    add_reference :dishes, :menu, foreign_key: true
    add_reference :drinks, :menu, foreign_key: true
  end
end
