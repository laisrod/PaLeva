class Establishment < ApplicationRecord
  belongs_to :user

  validates :name, :social_name, :cnpj,
            :full_address, :city, :state,
            :postal_code, :email, :phone_number, presence: true
  validates :cnpj, :email, uniqueness: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validate :cnpj_valid

  before_create :generate_code

  private

  def generate_code
    new_code = SecureRandom.hex(6)
    Establishment.where(code: new_code).exists? ? generate_code : self.code = new_code
  end

  def cnpj_valid
    errors.add(:cnpj, "inválido") unless CNPJ.valid?(cnpj)
  end
end
