class User < ApplicationRecord
  has_one :establishment, dependent: :destroy
  
  # Validações de email e senha (mantidas para compatibilidade, mas senha não é mais usada para autenticação)
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  validates :name, :email, :last_name, :cpf, presence: true
  validates :cpf, uniqueness: true, format: { with: /\A\d{3}\.\d{3}\.\d{3}-\d{2}\z/ }
  validates :role, inclusion: { in: [true, false] }
  validate :cpf_valid

  before_create :check_employee_invitation

  def owner?
    self.role? # Retorna true se role == true
  end
  
  private

  def cpf_valid
    errors.add(:cpf, "inválido") unless CPF.valid?(cpf)
  end

  def check_employee_invitation
    invitation = EmployeeInvitation.find_by(email: email, cpf: cpf)
    if invitation.present?
      self.establishment_id = invitation.establishment_id
      self.role = false
    end
  end

  def has_establishment?
    establishment.present?
  end
end
