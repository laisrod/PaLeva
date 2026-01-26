
class Drink < ApplicationRecord
  belongs_to :establishment
  has_one_attached :photo

  # Validações de foto apenas se estiver presente
  validates :photo, content_type: ['image/png', 'image/jpeg', 'image/webp'],
                    size: { less_than: 5.megabytes },
                    if: -> { photo.attached? }

  validates :name, :description, presence: true
  has_many :portions, dependent: :destroy
  has_many :drink_tags
  has_many :tags, through: :drink_tags, dependent: :destroy
  has_many :menu_items, dependent: :destroy
end