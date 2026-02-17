module Api
  module V1
    class TagSerializer < BaseSerializer
      attributes :id, :name, :category
    end
  end
end
