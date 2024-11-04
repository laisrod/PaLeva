class AddStatusToTables < ActiveRecord::Migration[7.2]
  def change
    add_column :dishes, :status, :boolean, default: true, null: false
    add_column :drinks, :status, :boolean, default: true, null: false
  end
end
