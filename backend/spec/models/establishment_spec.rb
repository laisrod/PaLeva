require 'rails_helper'

RSpec.describe Establishment, type: :model do
  it 'é válido com atributos válidos' do
    user = User.create!(name: 'User', email: 'user134@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '67.204.530/0001-22', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment24@example.com', phone_number: '1234567890', user_id: user.id)
 
    expect(establishment).to be_valid
  end

  it 'não é válido sem um nome' do
    user = User.create!(name: 'User', email: 'user13456@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    establishment = Establishment.new(social_name: 'Establishment', cnpj: '74.952.874/0001-85', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2456@example.com', phone_number: '1234567890', user_id: user.id)
    expect(establishment).not_to be_valid
  end

  it 'não é válido sem uma descrição' do
    establishment = Establishment.new(
      name: 'Restaurante Teste', 
      phone_number: '(11) 98765-4321', 
    )
    expect(establishment).not_to be_valid
  end

  it 'não é válido sem um número de telefone' do
    establishment = Establishment.new(
      name: 'Restaurante Teste', 
    )
    expect(establishment).not_to be_valid
  end
end