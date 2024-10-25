class User < ApplicationRecord
  has_one :establishment

  validates :name, :email, :password_digest, presence: true
end
