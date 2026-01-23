class CreateDrinkTags < ActiveRecord::Migration[7.2]
  def change
    create_table :drink_tags do |t|
      t.references :drink, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end
  end
end
