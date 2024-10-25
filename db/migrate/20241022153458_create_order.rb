class CreateOrder < ActiveRecord::Migration[7.2]
  def change
    create_table :orders do |t|
      t.references :establishment, null: false, foreign_key: true
      t.references :menu_item, null: false, foreign_key: true
      t.datetime :order_date, null: false
      t.string :status, default: 'pending'
      t.decimal :total_price, precision: 10, scale: 2

      t.timestamps
    end
  end
end
