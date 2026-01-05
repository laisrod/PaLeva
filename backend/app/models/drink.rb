class Drink < ApplicationRecord
  belongs_to :establishment
  has_one_attached :photo
  validates :name, :description, presence: true
  has_many :portions, dependent: :destroy
end