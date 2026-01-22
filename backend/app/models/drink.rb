
class Drink < ApplicationRecord
  belongs_to :establishment
  has_one_attached :photo

  validates :photo, attached: true                  # obrigatório
  # Opcional: mais validações úteis
  validates :photo, content_type: ['image/png', 'image/jpeg', 'image/jpeg'],
                    size: { less_than: 5.megabytes }

  validates :name, :description, presence: true
  has_many :portions, dependent: :destroy
end