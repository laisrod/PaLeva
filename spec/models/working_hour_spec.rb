require 'rails_helper'

RSpec.describe WorkingHour, type: :model do
  context 'validations' do
    it 'is valid with valid attributes' do
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

    it 'is invalid without a week_day on update' do
      user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
      establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '67.204.530/0001-22', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment24@example.com', phone_number: '1234567890', user_id: user.id)
      working_hour = WorkingHour.new(
        week_day: 'Monday',
        open: true,
        opening_hour: '10:00',
        closing_hour: '22:00',
        establishment: establishment
      )

      working_hour.week_day = nil
      working_hour.save(validate: false) # Save without validation to simulate update
      expect(working_hour).to be_invalid(:update)
    end

    it 'is invalid without an opening_hour on update' do
      user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
      establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '67.204.530/0001-22', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment24@example.com', phone_number: '1234567890', user_id: user.id)
      working_hour = WorkingHour.new(
        week_day: 'Monday',
        open: true,
        opening_hour: '10:00',
        closing_hour: '22:00',
        establishment: establishment
      )

      working_hour.opening_hour = nil
      working_hour.save(validate: false) # Save without validation to simulate update
      expect(working_hour).to be_invalid(:update)
    end

    it 'is invalid without a closing_hour on update' do
      user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
      establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '67.204.530/0001-22', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment24@example.com', phone_number: '1234567890', user_id: user.id)
      working_hour = WorkingHour.new(
        week_day: 'Monday',
        open: true,
        opening_hour: '10:00',
        closing_hour: '22:00',
        establishment: establishment
      )

      working_hour.closing_hour = nil
      working_hour.save(validate: false) # Save without validation to simulate update
      expect(working_hour).to be_invalid(:update)
    end
  end
end