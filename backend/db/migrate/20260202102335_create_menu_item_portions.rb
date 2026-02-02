class CreateMenuItemPortions < ActiveRecord::Migration[7.2]
  def change
    create_table :menu_item_portions do |t|
      t.references :menu_item, null: false, foreign_key: true
      t.references :portion, null: false, foreign_key: true

      t.timestamps
    end

    add_index :menu_item_portions, [:menu_item_id, :portion_id], unique: true
  end
end
