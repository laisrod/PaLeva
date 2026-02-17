module Api
  module V1
    class MenuItemSerializer < BaseSerializer
      attributes :id
      
      # MenuItem pode ter dish ou drink, mas não ambos
      attribute :name, if: :has_dish_or_drink?
      attribute :description, if: :has_dish_or_drink?
      
      def name
        object.dish&.name || object.drink&.name
      end
      
      def description
        object.dish&.description || object.drink&.description
      end
      
      def has_dish_or_drink?
        object.dish.present? || object.drink.present?
      end
    end
  end
end
