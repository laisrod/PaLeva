class CreateOrder < ActiveRecord::Migration[7.2]
  def change
    create_table :orders do |t|
      t.references :establishment, null: false, foreign_key: true
      t.string :status, default: 'draft'
      t.decimal :total_price, precision: 10, scale: 2
      t.string :customer_name
      t.string :customer_email
      t.string :customer_cpf
      t.string :code
      t.timestamps
    end
  end
end
