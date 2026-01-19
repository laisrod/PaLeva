module Searchable
  extend ActiveSupport::Concern

  class_methods do
    def search(query)
      return all if query.blank?
      
      all
    end
  end
end

