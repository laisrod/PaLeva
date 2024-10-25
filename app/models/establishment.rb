class Establishment < ApplicationRecord
  has_many :users
  has_many :employees
end
  