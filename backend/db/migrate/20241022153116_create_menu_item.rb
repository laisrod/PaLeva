class CreateMenuItem < ActiveRecord::Migration[7.2]
  def change
    create_table :menu_items do |t|
      t.references :menu, foreign_key: true, null: false
      t.references :drink, foreign_key: true
      t.references :dish, foreign_key: true
      
      t.timestamps
    end
  end
end