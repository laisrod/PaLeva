class CreateMenu < ActiveRecord::Migration[7.2]
  def change
    create_table :menus do |t|
      t.string :name, null: false
      t.text :description
      t.boolean :active, default: true
      t.references :establishment, null: false, foreign_key: true

      t.timestamps
    end
  end
end
