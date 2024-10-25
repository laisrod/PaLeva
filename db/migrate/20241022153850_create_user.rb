class CreateUser < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :role, default: 'employee'
      t.references :establishment, null: false, foreign_key: true

      t.timestamps
    end
  end
end
