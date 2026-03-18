class AddForeignKeysToMenuItems < ActiveRecord::Migration[7.2]
  def change
    return unless table_exists?(:menu_items)

    if table_exists?(:drinks) && !foreign_key_exists?(:menu_items, :drinks)
      add_foreign_key :menu_items, :drinks, column: :drink_id
    end

    if table_exists?(:dishes) && !foreign_key_exists?(:menu_items, :dishes)
      add_foreign_key :menu_items, :dishes, column: :dish_id
    end
  end
end
