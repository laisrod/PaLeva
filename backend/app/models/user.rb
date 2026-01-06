class User < ApplicationRecord
  require 'cpf_cnpj' unless defined?(CPF)
  
  devise :database_authenticatable, :registerable,
         :rememberable, :validatable

  has_one :establishment, dependent: :destroy

  validates :name, :email, :last_name, :cpf, presence: true
  validates :cpf, uniqueness: true, format: { with: /\A\d{3}\.\d{3}\.\d{3}-\d{2}\z/ }
  validates :role, inclusion: { in: [true, false] }
  validate :cpf_valid

  has_secure_token :api_token

  
  before_create :check_employee_invitation

  def owner?
    self.role?
  end
  
  private

  def cpf_valid
    return unless cpf.present?
    
    # Remover formatação para validação
    cpf_clean = cpf.gsub(/[^0-9]/, '')
    
    # Validar CPF usando a gem cpf_cnpj
    unless CPF.valid?(cpf_clean)
      errors.add(:cpf, "inválido")
    end
  end

  def check_employee_invitation
    return unless email.present? && cpf.present?
    
    begin
      # Limpar CPF para busca (remover formatação)
      # O CPF no User está formatado (000.000.000-00), mas no EmployeeInvitation está sem formatação
      cpf_clean = cpf.to_s.gsub(/[^0-9]/, '')
      
      # Buscar convite pelo email e CPF
      # EmployeeInvitation armazena CPF sem formatação (apenas números)
      invitations = EmployeeInvitation.where(email: email).to_a
      invitation = invitations.find do |inv|
        inv_cpf_clean = inv.cpf.to_s.gsub(/[^0-9]/, '')
        inv_cpf_clean == cpf_clean
      end
      
      if invitation
        self.establishment_id = invitation.establishment_id
        self.role = false
      end
    rescue => e
      Rails.logger.error "Error checking employee invitation: #{e.class} - #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      # Não falhar o cadastro se houver erro ao verificar convite
      # Apenas logar o erro e continuar
    end
  end

  def has_establishment?
    establishment.present?
  end
end
