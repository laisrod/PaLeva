class Tag < ApplicationRecord
    has_many :dish_tags, dependent: :destroy
    has_many :dishes, through: :dish_tags
    
    validates :name, presence: true, uniqueness: true

    def  self .filter_by_title(name) 
      where( "name ILIKE ?" , "% #{name} %" ) 
    end
  end