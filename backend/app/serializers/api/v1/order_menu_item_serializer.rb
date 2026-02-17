module Api
  module V1
    class OrderMenuItemSerializer < BaseSerializer
      attributes :id, :quantity, :menu_id, :menu_item_id, :portion_id
      
      has_one :menu, serializer: Api::V1::MenuSerializer, if: :has_menu?
      has_one :menu_item, serializer: Api::V1::MenuItemSerializer, if: :has_menu_item?
      has_one :portion, serializer: Api::V1::PortionSerializer, if: :has_portion?
      
      # Para manter compatibilidade com o frontend, adiciona campos calculados
      attribute :menu_item_name, if: :has_menu_item?
      attribute :menu_item_description, if: :has_menu_item?
      
      def has_menu?
        object.menu_id.present?
      end
      
      def has_menu_item?
        object.menu_item_id.present?
      end
      
      def has_portion?
        object.portion_id.present?
      end
      
      def menu_item_name
        return nil unless object.menu_item
        object.menu_item.dish&.name || object.menu_item.drink&.name
      end
      
      def menu_item_description
        return nil unless object.menu_item
        object.menu_item.dish&.description || object.menu_item.drink&.description
      end
    end
  end
end
