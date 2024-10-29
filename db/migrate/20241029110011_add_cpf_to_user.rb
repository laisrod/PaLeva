class AddCpfToUser < ActiveRecord::Migration[7.2]
  def change
    change_table :users do |t|

      t.string :cpf, null: false
      t.string :last_name, null: false
   end
  end
end
