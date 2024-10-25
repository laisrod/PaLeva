class CreateEstablishment < ActiveRecord::Migration[7.2]
  def change
    create_table :establishments do |t|
      t.string :name, null: false
      t.text :description
      t.string :code, null: false
      t.string :full_address, null: false
      t.string :city, null: false
      t.string :state, null: false
      t.string :postal_code
      t.string :email
      t.string :phone_number
      t.string :opening_hours

      t.timestamps
    end
  end
end
