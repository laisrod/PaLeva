# Concern for searchable models
module Searchable
  extend ActiveSupport::Concern

  class_methods do
    def search(query)
      return all if query.blank?
      
      # Override this method in the model that includes this concern
      # Example: where("name LIKE ?", "%#{query}%")
      all
    end
  end
end

