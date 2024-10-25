require 'rails_helper'

RSpec.describe Establishment, type: :model do
  it 'is valid with valid attributes' do
    establishment = Establishment.new(name: 'Restaurante Teste', description: 'Descrição do restaurante', phone_number: '1234567890', opening_hours: '10:00', code: 'EST123', city: 'Sample City', state: 'Sample State', postal_code: '12345')    
    expect(establishment).to be_valid
  end

  it 'is not valid without a name' do
    establishment = Establishment.new(description: 'Descrição do restaurante', phone_number: '1234567890', opening_hours: '10:00')
    expect(establishment).not_to be_valid
  end

  it 'is not valid without a description' do
    establishment = Establishment.new(name: 'Restaurante Teste', phone_number: '1234567890', opening_hours: '10:00')
    expect(establishment).not_to be_valid
  end

  it 'is not valid without a phone number' do
    establishment = Establishment.new(name: 'Restaurante Teste', description: 'Descrição do restaurante', opening_hours: '10:00')
    expect(establishment).not_to be_valid
  end

  it 'is not valid without a opening hours' do
    establishment = Establishment.new(name: 'Restaurante Teste', description: 'Descrição do restaurante', phone_number: '1234567890')
    expect(establishment).not_to be_valid
  end
end