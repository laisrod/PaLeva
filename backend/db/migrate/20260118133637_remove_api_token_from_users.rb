class RemoveApiTokenFromUsers < ActiveRecord::Migration[7.2]
  def change
    remove_index :users, :api_token, if_exists: true
    remove_column :users, :api_token, :string
  end
end
