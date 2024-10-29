class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_one :establishment

  validates :name, :email, :last_name, :cpf, presence: true
  validate :can_only_have_one_establishment

  private

  def can_only_have_one_establishment
    errors.add(:base, "Você já possui um restaurante.") if establishment.present?
  end
end
