class Drink < ApplicationRecord
  belongs_to :establishment
  has_one_attached :photo
end