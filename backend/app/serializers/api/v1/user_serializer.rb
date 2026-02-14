module Api
  module V1
    class UserSerializer < BaseSerializer
      attributes :id, :email, :name, :role
      
      has_one :establishment, if: :include_establishment?
      
      def include_establishment?
        object.establishment.present?
      end
    end
  end
end
