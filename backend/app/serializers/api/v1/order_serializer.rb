module Api
  module V1
    class OrderSerializer < BaseSerializer
      attributes :id, :code, :status, :total_price, :customer_name, 
                 :customer_email, :customer_phone, :customer_cpf,
                 :created_at, :updated_at, :establishment_id, :cancellation_reason
      
      has_many :order_menu_items, serializer: Api::V1::OrderMenuItemSerializer
      
      def total_price
        object.total_price ? object.total_price.to_f : 0.0
      end
    end
  end
end
