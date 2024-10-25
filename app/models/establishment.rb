class Establishment < ApplicationRecord
  has_many :users
  has_many :employees

  validates :name, presence: { message: I18n.t('activerecord.errors.models.establishment.attributes.name.blank') }
  validates :description, presence: { message: I18n.t('activerecord.errors.models.establishment.attributes.description.blank') }
  validates :phone_number, presence: { message: I18n.t('activerecord.errors.models.establishment.attributes.phone_number.blank') }
  validates :opening_hours, presence: { message: I18n.t('activerecord.errors.models.establishment.attributes.opening_hours.blank') }
  validates :code, presence: { message: I18n.t('activerecord.errors.models.establishment.attributes.code.blank') }
  validates :city, presence: { message: I18n.t('activerecord.errors.models.establishment.attributes.city.blank') }
  validates :state, presence: { message: I18n.t('activerecord.errors.models.establishment.attributes.state.blank') }
  validates :postal_code, presence: { message: I18n.t('activerecord.errors.models.establishment.attributes.postal_code.blank') }
end
