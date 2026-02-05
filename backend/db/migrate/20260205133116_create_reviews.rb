class CreateReviews < ActiveRecord::Migration[7.2]
  def change
    create_table :reviews do |t|
      t.references :order, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :rating, null: false
      t.text :comment

      t.timestamps
    end
    
    add_index :reviews, [:order_id, :user_id], unique: true
    add_index :reviews, :rating
  end
end
