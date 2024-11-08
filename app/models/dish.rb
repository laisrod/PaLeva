class Dish < ApplicationRecord
  belongs_to :establishment
  
  has_one_attached :photo
  has_many :portions, dependent: :destroy
  has_many :dish_tags
  has_many :tags, through: :dish_tags, dependent: :destroy
end
