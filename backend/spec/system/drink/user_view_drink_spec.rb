require 'rails_helper'

describe 'Usuário vê bebidas' do
  it 'a partir do menu principal' do
    # Arrange
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567', role: true)
    establishment = Establishment.create!(
      name: 'Meu Restaurante',
      social_name: 'Restaurante LTDA',
      cnpj: '39.513.250/0001-60',
      full_address: 'Rua Principal, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '12345-678',
      email: "contato@restaurante.com",
      phone_number: '11999999999',
      user: user
    )
    drink = Drink.create!(name: 'Coca-Cola', description: 'Refrigerante de cola', status: true, establishment: establishment)
    drink = Drink.create!(name: 'Suco de laranja', description: 'Suco natural', status: true, establishment: establishment)
    
   
    # Act
    login_as(user)
    visit root_path
    click_on 'Ver Bebidas'

    # Assert
    expect(current_path).to eq establishment_drinks_path(establishment)
    expect(page).to have_content 'Bebidas'
    expect(page).to have_content 'Coca-Cola'
    expect(page).to have_content 'Suco de laranja'
  end

  it 'e não existem bebidas cadastradas' do
    # Arrange
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567', role: true)
    establishment = Establishment.create!(
      name: 'Meu Restaurante',
      social_name: 'Restaurante LTDA',
      cnpj: '39.513.250/0001-60',
      full_address: 'Rua Principal, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '12345-678',
      email: "contato@restaurante.com",
      phone_number: '11999999999',
      user: user
    )
    # Act
    login_as(user)
    visit root_path
    click_on 'Ver Bebidas'

    # Assert
    expect(page).to have_content 'Nenhuma bebida disponível'
  end

  it 'e volta para o menu principal' do
    #Arrange
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567', role: true)
    establishment = Establishment.create!(
      name: 'Meu Restaurante',
      social_name: 'Restaurante LTDA',
      cnpj: '39.513.250/0001-60',
      full_address: 'Rua Principal, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '12345-678',
      email: "contato@restaurante.com",
      phone_number: '11999999999',
      user: user
    )
    # Act
    login_as(user)
    visit root_path
    click_on 'Bebidas'
    click_on 'Voltar'

    # Assert
    expect(current_path).to eq '/establishments'
  end
end