module Api
  module V1
    class EstablishmentSerializer < BaseSerializer
      attributes :id, :name, :code, :city, :state, :full_address, :phone_number, :email
      
      has_many :working_hours, serializer: Api::V1::WorkingHourSerializer, if: :include_working_hours?
      
      def include_working_hours?
        instance_options[:include_working_hours] || false
      end
    end
  end
end
