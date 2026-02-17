module Api
  module V1
    class BaseSerializer < ActiveModel::Serializer
      # Base serializer para todos os serializers da API v1
      
      private
      
      # Configura ActiveStorage URL options quando necessário
      def configure_active_storage_url_options
        return unless scope && scope.respond_to?(:request) && scope.request
        
        ActiveStorage::Current.url_options = { 
          host: scope.request.base_url,
          protocol: scope.request.protocol
        }
      end
    end
  end
end
