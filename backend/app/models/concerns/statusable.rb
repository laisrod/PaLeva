module Statusable
  extend ActiveSupport::Concern

  included do
  end

  class_methods do
    def with_status(status)
      return all unless status.present?
      where(status: status) if statuses.keys.include?(status.to_s)
    end

    def active
      where.not(status: %w[cancelled completed])
    end
  end
end

