class AddCustomerPhoneToOrder < ActiveRecord::Migration[7.2]
  def change
    add_column :orders, :customer_phone, :string
  end
end
