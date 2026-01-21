class Establishment < ApplicationRecord
  include CodeGeneratable

  belongs_to :user
  has_many :drinks, dependent: :destroy
  has_many :dishes, dependent: :destroy
  has_many :working_hours, dependent: :destroy
  has_many :menus, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :employee_invitations, dependent: :destroy
  has_many :users

  validates :name, :social_name, :cnpj,
            :full_address, :city, :state,
            :postal_code, :email, :phone_number, presence: true
  validates :cnpj, :email, uniqueness: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validate :cnpj_valid

  after_create :set_user_as_owner #quando estabelecimento é criado, o usuario é setado como dono
  after_save :create_working_hours

  private

  def cnpj_valid
    errors.add(:cnpj, "inválido") unless CNPJ.valid?(cnpj)
  end

  def create_working_hours
    if working_hours.empty?
      %w[Domingo Segunda Terça Quarta Quinta Sexta Sábado].each do |day|
        WorkingHour.create(week_day: day, establishment: self)
      end
    end
  end

  def set_user_as_owner
    self.user.role = true # quando cria estabelecimento, vira dono
    self.user.save
  end
end
