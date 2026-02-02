class AddMenuIdToOrderMenuItems < ActiveRecord::Migration[7.2]
  def change
    add_reference :order_menu_items, :menu, null: true, foreign_key: true
    change_column_null :order_menu_items, :menu_item_id, true
    change_column_null :order_menu_items, :portion_id, true
  end
end
