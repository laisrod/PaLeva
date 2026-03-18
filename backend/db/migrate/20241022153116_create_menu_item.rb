class CreateMenuItem < ActiveRecord::Migration[7.2]
  def change
    create_table :menu_items do |t|
      t.references :menu, foreign_key: true, null: false
      # Drinks and dishes are created in later migrations; add FKs after both tables exist.
      t.references :drink, foreign_key: false
      t.references :dish, foreign_key: false
      
      t.timestamps
    end
  end
end