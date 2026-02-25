class User < ApplicationRecord
  require 'securerandom'
  devise :database_authenticatable, :registerable,
         :rememberable, :validatable
  # OAuth configurado manualmente via OmniAuth::Builder (não via Devise)
  # para evitar conflito com path_prefix

  has_one :establishment, dependent: :destroy
  has_many :orders, dependent: :nullify
  has_many :reviews, dependent: :destroy
  has_many :ratings, dependent: :destroy

  validates :name, :email, :last_name, presence: true
  validates :cpf, uniqueness: true, allow_nil: true,
            format: { with: /\A\d{3}\.\d{3}\.\d{3}-\d{2}\z/, allow_nil: true }
  validates :role, inclusion: { in: [true, false] }
  validate :cpf_valid


  
  before_create :check_employee_invitation

  def owner?
    self.role?
  end

  def has_establishment?
    establishment.present?
  end

  # Método para criar usuário a partir de dados OAuth do Google (JSON)
  def self.from_google_oauth(user_info)
    where(provider: 'google_oauth2', uid: user_info['sub']).first_or_create do |user|
      user.email = user_info['email']
      user.name = user_info['given_name'] || user_info['name']&.split&.first || 'Usuário'
      user.last_name = user_info['family_name'] || user_info['name']&.split&.last || ''
      user.password = Devise.friendly_token[0, 20]
      user.role = true # Default: owner (pode ajustar conforme necessário)
      user.provider = 'google_oauth2'
      user.uid = user_info['sub']
      user.cpf ||= generate_unique_oauth_cpf
    end
  end

  def self.generate_unique_oauth_cpf
    loop do
      digits = SecureRandom.random_number(10**11).to_s.rjust(11, '0')
      formatted_cpf = "#{digits[0..2]}.#{digits[3..5]}.#{digits[6..8]}-#{digits[9..10]}"
      return formatted_cpf unless exists?(cpf: formatted_cpf)
    end
  end
  private_class_method :generate_unique_oauth_cpf

  # Método para atualizar dados do usuário OAuth do Google (JSON)
  def update_google_oauth_data(user_info)
    update_columns(
      email: user_info['email'],
      name: user_info['given_name'] || user_info['name']&.split&.first || name,
      last_name: user_info['family_name'] || user_info['name']&.split&.last || last_name
    )
    reload
  end
  
  private

  def cpf_valid
    # Para usuários OAuth (provider presente), não exigimos CPF válido.
    # O banco exige NOT NULL, então usamos um CPF placeholder na criação
    # (`from_google_oauth`) e pulamos a validação aqui.
    return if provider.present?

    # Para usuários comuns, CPF é opcional, mas se fornecido deve ser válido.
    return if cpf.blank?

    errors.add(:cpf, "inválido") unless CPF.valid?(cpf)
  end

  def check_employee_invitation
    invitation = EmployeeInvitation.find_by(email: email, cpf: cpf)
    if invitation.present?
      self.establishment_id = invitation.establishment_id
      # Só sobrescrever role se não foi explicitamente definido
      # (role já foi definido pelo controller baseado no parâmetro enviado)
      self.role = false
    end
  end
end
