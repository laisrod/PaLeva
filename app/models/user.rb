  class User < ApplicationRecord
    devise :database_authenticatable, :registerable,
          :rememberable, :validatable

    has_one :establishment, dependent: :destroy

    validates :name, :email, :last_name, :cpf, presence: true
    validate :cpf_valid
    
    before_create :check_employee_invitation
    before_create :set_first_user_as_admin

    after_create :set_as_owner, if: :has_establishment?


    def owner?
      role == true
    end
    
    private

    def cpf_valid
      errors.add(:cpf, "inválido") unless CPF.valid?(cpf)
    end

    def check_employee_invitation
      invitation = EmployeeInvitation.find_by(email: email, cpf: cpf)
      if invitation
        self.establishment_id = invitation.establishment_id
        self.role = :employee
      end
    end

    def set_as_owner
      update(role: true) if establishment.present?
    end

    def has_establishment?
      establishment.present?
    end

    def set_first_user_as_admin
      self.role = true if User.count.zero?
    end

  end