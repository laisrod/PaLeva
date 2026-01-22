class Dish < ApplicationRecord
  belongs_to :establishment
  
  has_one_attached :photo
  has_many :portions, dependent: :destroy
  has_many :dish_tags, dependent: :destroy
  has_many :tags, through: :dish_tags
  
  accepts_nested_attributes_for :tags, reject_if: :all_blank, allow_destroy: false
  
  before_save :find_or_create_nested_tags
  
  private
  
  def find_or_create_nested_tags
    tags.each do |tag|
      if tag.new_record? && tag.name.present?
        existing_tag = Tag.find_or_create_by(name: tag.name)
        tags.delete(tag)
        tags << existing_tag unless tags.include?(existing_tag)
      end
    end
  end
end
