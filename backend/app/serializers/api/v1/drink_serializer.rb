module Api
  module V1
    class DrinkSerializer < BaseSerializer
      attributes :id, :name, :description, :alcoholic, :calories, :photo_url,
                 :min_price, :max_price, :average_rating, :ratings_count
      
      has_many :tags, serializer: Api::V1::TagSerializer
      has_many :portions, serializer: Api::V1::PortionSerializer, if: :include_portions?
      
      def photo_url
        return nil unless object.photo.attached?
        
        begin
          configure_active_storage_url_options
          
          # ActiveModel::Serializers passa o controller como scope
          if scope.respond_to?(:url_for)
            scope.url_for(object.photo)
          else
            # Fallback: usa Rails.application.routes com ActiveStorage::Current configurado
            Rails.application.routes.url_helpers.url_for(object.photo)
          end
        rescue => e
          Rails.logger.error "Erro ao gerar photo_url para drink #{object.id}: #{e.message}"
          nil
        end
      end
      
      def min_price
        prices = object.portions.pluck(:price)
        prices.min ? prices.min.to_f : nil
      end
      
      def max_price
        prices = object.portions.pluck(:price)
        prices.max ? prices.max.to_f : nil
      end
      
      def include_portions?
        instance_options[:include_portions] || false
      end
    end
  end
end
