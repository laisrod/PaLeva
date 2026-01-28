class AddCategoryToTags < ActiveRecord::Migration[7.2]
  def change
    add_column :tags, :category, :string
  end
end
