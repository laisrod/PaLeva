require 'rails_helper'

describe 'Usuário vê bebidas' do
  it 'a partir do menu principal' do
    # Arrange
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    restaurant = Establishment.create!(name: 'PastoPizza', social_name: 'PastoPizza', cnpj: '37.803.284/0001-64', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2558@example.com', phone_number: '1234567890', user_id: user.id)

    drink = Drink.create!(name: 'Coca-Cola', description: 'Refrigerante de cola', status: true, establishment: restaurant)
    drink = Drink.create!(name: 'Suco de laranja', description: 'Suco natural', status: true, establishment: restaurant)
    
   
    # Act
    login_as(user)
    visit root_path
    click_on 'Bebidas'

    # Assert
    expect(current_path).to eq establishment_drinks_path(restaurant)
    expect(page).to have_content 'Bebidas'
    expect(page).to have_content 'Coca-Cola'
    expect(page).to have_content 'Suco de laranja'
  end

  it 'e não existem bebidas cadastradas' do
    # Arrange
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    restaurant = Establishment.create!(name: 'PastoPizza', social_name: 'PastoPizza', cnpj: '37.803.284/0001-64', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2558@example.com', phone_number: '1234567890', user_id: user.id)

    # Act
    login_as(user)
    visit root_path
    click_on 'Bebidas'

    # Assert
    expect(page).to have_content 'Nenhuma bebida disponível'
  end

  it 'e volta para o menu principal' do
    #Arrange
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    restaurant = Establishment.create!(name: 'PastoPizza', social_name: 'PastoPizza', cnpj: '37.803.284/0001-64', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2558@example.com', phone_number: '1234567890', user_id: user.id)

    # Act
    login_as(user)
    visit root_path
    click_on 'Bebidas'
    click_on 'Voltar'

    # Assert
    expect(current_path).to eq '/establishments'
  end
end