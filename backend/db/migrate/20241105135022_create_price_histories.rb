class CreatePriceHistories < ActiveRecord::Migration[7.2]
  def change
    create_table :price_histories do |t|
      t.decimal :price, precision: 10, scale: 2
      t.references :portion, foreign_key: true
      t.timestamps
    end

    add_column :portions, :deleted_at, :datetime
    add_index :portions, :deleted_at
  end
end
