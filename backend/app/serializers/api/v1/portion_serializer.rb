module Api
  module V1
    class PortionSerializer < BaseSerializer
      attributes :id, :description, :price
      
      def price
        object.price.to_f
      end
    end
  end
end
