class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :rememberable, :validatable

  has_one :establishment, dependent: :destroy

  validates :name, :email, :last_name, :cpf, presence: true
  validate :cpf_valid

  private

  def cpf_valid
    errors.add(:cpf, "inválido") unless CPF.valid?(cpf)
  end
end
