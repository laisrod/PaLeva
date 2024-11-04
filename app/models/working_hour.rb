class WorkingHour < ApplicationRecord
  belongs_to :establishment
  validates :week_day, :opening_hour, :closing_hour, presence: true
end