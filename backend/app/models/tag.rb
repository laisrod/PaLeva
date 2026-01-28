class Tag < ApplicationRecord
  CATEGORIES = %w[dish drink].freeze

  has_many :dish_tags
  has_many :dishes, through: :dish_tags, dependent: :destroy
  has_many :drink_tags
  has_many :drinks, through: :drink_tags, dependent: :destroy

  validates :name, presence: true
  validates :name, uniqueness: { scope: :category }
  validates :category, inclusion: { in: CATEGORIES }, allow_nil: false

  scope :for_dishes, -> { where(category: 'dish') }
  scope :for_drinks, -> { where(category: 'drink') }

  def self.filter_by_title(name)
    where("name ILIKE ?", "%#{name}%")
  end
end