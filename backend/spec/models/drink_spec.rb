require 'rails_helper'

RSpec.describe Drink, type: :model do
  it 'é válido com atributos válidos' do
    user = User.create!(
      name: 'Usuário', 
      email: 'usuario@exemplo.com', 
      password: 'senha1234567', 
      last_name: 'Sobrenome', 
      cpf: '483.556.180-50'
    )
    
    establishment = Establishment.create!(
      name: 'Estabelecimento', 
      social_name: 'Estabelecimento', 
      cnpj: '43.970.890/0001-77', 
      full_address: 'Rua Principal, 123', 
      city: 'Cidade Exemplo', 
      state: 'SP', 
      postal_code: '12345-678', 
      email: 'estabelecimento@exemplo.com', 
      phone_number: '(11) 98765-4321', 
      user_id: user.id
    )
    
    drink = Drink.new(
      name: 'Suco', 
      description: 'Descrição do suco',
      calories: 10.0, 
      establishment_id: establishment.id, 
      alcoholic: false
    )
    
    expect(drink).to be_valid
  end


  it "has default status" do
    user = User.create!(
      name: 'Usuário', 
      email: 'usuario@exemplo.com', 
      password: 'senha1234567', 
      last_name: 'Sobrenome', 
      cpf: '483.556.180-50'
    )
    establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '67.204.530/0001-22', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment24@example.com', phone_number: '1234567890', user_id: user.id)
    drink = Drink.create(
      name: "Test Drink",
      description: "A test drink",
      alcoholic: false,
      calories: 100,
      status: true,
      establishment: establishment
    )

    expect(drink.status).not_to be_nil
  end

  it "can toggle status" do
    user = User.create!(
      name: 'Usuário', 
      email: 'usuario@exemplo.com', 
      password: 'senha1234567', 
      last_name: 'Sobrenome', 
      cpf: '483.556.180-50'
    )
    establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '67.204.530/0001-22', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment24@example.com', phone_number: '1234567890', user_id: user.id)
    drink = Drink.create(
      name: "Test Drink",
      description: "A test drink",
      alcoholic: false,
      calories: 100,
      status: true,
      establishment: establishment
    )

    original_status = drink.status
    drink.update(status: !drink.status)
    
    expect(drink.status).to eq(!original_status)
  end

  it "não salva sem nome" do
    user = User.create!(
      name: 'Usuário', 
      email: 'usuario@exemplo.com', 
      password: 'senha1234567', 
      last_name: 'Sobrenome', 
      cpf: '483.556.180-50'
    )
    establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '67.204.530/0001-22', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment24@example.com', phone_number: '1234567890', user_id: user.id)
    drink = Drink.create(
      description: "A test drink",
      alcoholic: false,
      calories: 100,
      status: true,
      establishment: establishment
    )

    expect(drink).not_to be_valid
  end

  it "não salva sem descrição" do
    user = User.create!(
      name: 'Usuário', 
      email: 'usuario@exemplo.com', 
      password: 'senha1234567', 
      last_name: 'Sobrenome', 
      cpf: '483.556.180-50'
    )
    establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '67.204.530/0001-22', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment24@example.com', phone_number: '1234567890', user_id: user.id)
    drink = Drink.create(
      name: "Test Drink",
      alcoholic: false,
      calories: 100,
      status: true,
      establishment: establishment
    )

    expect(drink).not_to be_valid
  end

  it "não salva sem estabelecimento" do
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    drink = Drink.create(
      name: "Test Drink",
      description: "A test drink",
      alcoholic: false,
    )

    expect(drink).not_to be_valid
  end
end