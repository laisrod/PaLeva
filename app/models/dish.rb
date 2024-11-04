class Dish < ApplicationRecord
  belongs_to :establishment
  has_one_attached :photo
  has_many :portions, dependent: :destroy
end
