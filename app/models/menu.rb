class Menu < ApplicationRecord
  belongs_to :establishment
  has_many :dishes
  has_many :drinks

  validates :name, presence: true, uniqueness: { scope: :establishment_id }
  validates :description, presence: true
end 