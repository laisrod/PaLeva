class AddUserIdToEstablishments < ActiveRecord::Migration[7.2]
  def change
    add_column :establishments, :user_id, :integer
  end
end
