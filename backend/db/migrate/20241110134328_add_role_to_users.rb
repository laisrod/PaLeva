class AddRoleToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :role, :boolean, default: false
  end
end
