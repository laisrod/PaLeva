class Menu < ApplicationRecord
  belongs_to :establishment
  has_many :menu_items, dependent: :destroy

  validates :name, presence: true, uniqueness: { scope: :establishment_id }
  validates :description, presence: true

  accepts_nested_attributes_for :menu_items, reject_if: :all_blank, allow_destroy: true

  def dishes
    menu_items.where.not(dish_id: nil).map(&:dish)
  end

  def drinks
    menu_items.where.not(drink_id: nil).map(&:drink)
  end
end 