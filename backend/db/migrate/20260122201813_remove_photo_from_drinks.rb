class RemovePhotoFromDrinks < ActiveRecord::Migration[7.2]
  def change
    remove_column :drinks, :photo, :string  # mude :string para o tipo correto se souber (ex: :text)
  end
end