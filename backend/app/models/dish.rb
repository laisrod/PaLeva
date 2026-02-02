class Dish < ApplicationRecord
  belongs_to :establishment
  
  has_one_attached :photo
  
  validates :photo, content_type: ['image/png', 'image/jpeg', 'image/webp'],
                    size: { less_than: 5.megabytes },
                    if: -> { photo.attached? }
  
  has_many :portions, dependent: :destroy
  has_many :dish_tags
  has_many :tags, through: :dish_tags, dependent: :destroy
  has_many :menu_items, dependent: :destroy
end
