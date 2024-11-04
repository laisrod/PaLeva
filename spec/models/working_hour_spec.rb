spec/models/working_hour_spec.rb

require 'rails_helper'

RSpec.describe WorkingHour, type: :model do
  it 'é válido com atributos válidos' do
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '67.204.530/0001-22', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment24@example.com', phone_number: '1234567890', user_id: user.id)
    working_hour = WorkingHour.new(
      week_day: 'Monday',
      open: true,
      opening_hour: '10:00',
      closing_hour: '22:00',
      establishment: establishment
    )
    expect(working_hour).to be_valid
  end
  it "não salva sem estabelecimento" do
    working_hour = WorkingHour.new(
      week_day: 'Monday',
      open: true,
      opening_hour: '10:00',
      closing_hour: '22:00'
    )
    expect(working_hour).not_to be_valid
  end

  it 'não salva sem dia da semana' do
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '67.204.530/0001-22', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment24@example.com', phone_number: '1234567890', user_id: user.id)
    working_hour = WorkingHour.new(
      open: true,
      opening_hour: '10:00',
      closing_hour: '22:00',
      establishment: establishment
    )
    expect(working_hour).not_to be_valid
  end

  it 'não salva sem horário de abertura' do
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '67.204.530/0001-22', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment24@example.com', phone_number: '1234567890', user_id: user.id)
    working_hour = WorkingHour.new(
      week_day: 'Monday',
      open: true,
      closing_hour: '22:00',
      establishment: establishment
    )
    expect(working_hour).not_to be_valid
  end

  it 'não salva sem horário de fechamento' do
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '67.204.530/0001-22', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment24@example.com', phone_number: '1234567890', user_id: user.id)
    working_hour = WorkingHour.new(
      week_day: 'Monday',
      open: true,
      opening_hour: '10:00',
      establishment: establishment
    )
    expect(working_hour).not_to be_valid
  end
end