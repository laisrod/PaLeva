module Api
  module V1
    class WorkingHourSerializer < BaseSerializer
      attributes :id, :week_day, :opening_hour, :closing_hour, :open
    end
  end
end
