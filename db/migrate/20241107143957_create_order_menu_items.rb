class CreateOrderMenuItems < ActiveRecord::Migration[7.2]
  def change
    create_table :order_menu_items do |t|
      
      t.integer :order_id
      t.integer :menu_item_id
      t.integer :portion_id

      t.timestamps
    end
  end
end
