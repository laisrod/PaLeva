class CreateOrderMenuItems < ActiveRecord::Migration[7.2]
  def change
    create_table :order_menu_items do |t|
      t.integer :quantity, null: false, default: 1
      t.references :order, foreign_key: true
      t.references :menu_item, foreign_key: true
      t.references :portion, foreign_key: true

      t.timestamps
    end
  end
end
