require 'rails_helper'

describe 'Usuário vê pratos' do
  it 'a partir do menu principal' do
    # Arrange
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    restaurant = Establishment.create!(name: 'PastoPizza', social_name: 'PastoPizza', cnpj: '37.803.284/0001-64', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2558@example.com', phone_number: '1234567890', user_id: user.id)
   
    dish = Dish.create!(name: 'Prato Test',
                       description: 'Descrição do prato test',
                       establishment: restaurant)

    # Act
    login_as(user)
    visit root_path
    click_on 'Ver Pratos'

    # Assert
    expect(page).to have_content 'Prato Test'
  end

  it 'e vê detalhes de um prato específico' do
    # Arrange
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    restaurant = Establishment.create!(name: 'PastoPizza', social_name: 'PastoPizza', cnpj: '37.803.284/0001-64', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2558@example.com', phone_number: '1234567890', user_id: user.id)
    
    dish = Dish.create!(name: 'Prato Test',
                       description: 'Descrição do prato test',
                       establishment: restaurant)

    # Act
    login_as(user)
    visit root_path
    click_on 'Ver Pratos'

    # Assert
    expect(page).to have_content 'Prato Test'
  end

  it 'e não existem pratos cadastrados' do
    # Arrange
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    establishment = Establishment.create!(
        name: 'Establishment',
        social_name: 'Establishment',
        cnpj: '85.661.749/0001-32',
        full_address: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        postal_code: '12345',
        email: 'establishment2588@example.com',
        phone_number: '1234567890',
        user_id: user.id
      )

    # Act
    login_as(user)
    visit root_path
    click_on 'Ver Pratos'
    # Assert
    expect(page).to have_content 'Nenhum prato cadastrado'
  end

  it 'e inativa um prato' do
    # Arrange
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    establishment = Establishment.create!(
        name: 'Establishment',
        social_name: 'Establishment',
        cnpj: '85.661.749/0001-32',
        full_address: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        postal_code: '12345',
        email: 'establishment2588@example.com',
        phone_number: '1234567890',
        user_id: user.id
      )
    dish = Dish.create!(name: 'Prato Test',
                       description: 'Descrição do prato test',
                       establishment: establishment)

    # Act
    login_as(user)
    visit establishment_dish_path(establishment, dish)
    click_on 'Inativar'
    # Assert
    expect(page).to have_content 'Status: Inativo'
    expect(page).to have_content 'Prato Test'
    expect(page).to have_content 'Descrição do prato test'
  end

  it 'e ativa um prato' do
    # Arrange
    user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
    establishment = Establishment.create!(
        name: 'Establishment',
        social_name: 'Establishment',
        cnpj: '85.661.749/0001-32',
        full_address: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        postal_code: '12345',
        email: 'establishment2588@example.com',
        phone_number: '1234567890',
        user_id: user.id
      )
    dish = Dish.create!(name: 'Prato Test',
                       description: 'Descrição do prato test',
                       establishment: establishment, status: false)
    
    # Act
    login_as(user)
    visit establishment_dish_path(establishment, dish)
    click_on 'Ativar'
    # Assert
    expect(page).to have_content 'Status: Ativo'
    expect(page).to have_content 'Prato Test'
    expect(page).to have_content 'Descrição do prato test'
    
  end
end
