class CreateRatings < ActiveRecord::Migration[7.2]
  def change
    create_table :ratings do |t|
      t.references :dish, null: true, foreign_key: true
      t.references :drink, null: true, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :rating, null: false
      t.text :comment

      t.timestamps
    end
    
    add_index :ratings, [:dish_id, :user_id], unique: true, where: 'dish_id IS NOT NULL'
    add_index :ratings, [:drink_id, :user_id], unique: true, where: 'drink_id IS NOT NULL'
    add_index :ratings, :rating
  end
end
