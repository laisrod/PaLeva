class Menu < ApplicationRecord
  belongs_to :establishment
  has_many :dishes
  has_many :drinks
  has_many :menu_items, dependent: :destroy
  validates :name, presence: true, uniqueness: { scope: :establishment_id }
  validates :description, presence: true

end 