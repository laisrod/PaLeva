module Api
  module V1
    class MenuSerializer < BaseSerializer
      attributes :id, :name, :description, :price, :active
      
      def price
        object.price ? object.price.to_f : 0.0
      end
    end
  end
end
