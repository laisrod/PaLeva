class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :rememberable, :validatable

  has_one :establishment, dependent: :destroy

  validates :name, :email, :last_name, :cpf, presence: true
  validates :cpf, uniqueness: true, format: { with: /\A\d{3}\.\d{3}\.\d{3}-\d{2}\z/ }
  validates :role, inclusion: { in: [true, false] }
  validate :cpf_valid


  
  before_create :check_employee_invitation

  def owner?
    self.role?
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
