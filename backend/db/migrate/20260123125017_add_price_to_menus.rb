class AddPriceToMenus < ActiveRecord::Migration[7.2]
  def change
    add_column :menus, :price, :decimal, precision: 10, scale: 2
  end
end
