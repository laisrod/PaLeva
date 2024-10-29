class CreateUser < ActiveRecord::Migration[7.2]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :role, default: 'employee'

      t.timestamps
    end
  end
end
