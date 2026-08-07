class AllowNullCpfForUsers < ActiveRecord::Migration[7.2]
  def change
    change_column_null :users, :cpf, true
  end
end
