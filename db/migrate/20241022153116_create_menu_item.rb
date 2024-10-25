class CreateMenuItem < ActiveRecord::Migration[7.2]
  def change
    create_table :menu_items do |t|
      t.string :name, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.string :category
      t.references :menu, foreign_key: true, null: false
      
      t.timestamps
    end
  end
end