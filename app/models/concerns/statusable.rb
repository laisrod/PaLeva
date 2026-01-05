# Concern for models with status
module Statusable
  extend ActiveSupport::Concern

  included do
    # Models that include this concern should have an enum :status
  end

  class_methods do
    def with_status(status)
      return all unless status.present?
      where(status: status) if respond_to?(:statuses) && statuses.keys.include?(status.to_s)
    end

    def active
      where.not(status: %w[cancelled completed])
    end
  end
end

