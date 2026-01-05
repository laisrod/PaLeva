class CreateEmployeeInvitation < ActiveRecord::Migration[7.2]
  def change
    create_table :employee_invitations do |t|
      t.references :establishment, null: false, foreign_key: true
      t.string :email
      t.string :cpf
      t.boolean :role, default: false
      t.timestamps
    end

    add_index :employee_invitations, [:establishment_id, :email, :cpf], unique: true
  end
end
