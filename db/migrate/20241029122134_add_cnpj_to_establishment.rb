class AddCnpjToEstablishment < ActiveRecord::Migration[7.2]
  def change
    change_table :establishments do |t|
      t.string :CNPJ

    end
  end
end
