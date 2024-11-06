class Tag < ApplicationRecord
    has_many :dish_tags
    has_many :dishes, through: :dish_tags, dependent: :destroy
    
    validates :name, presence: true, uniqueness: true
  end