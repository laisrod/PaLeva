require 'rails_helper'

describe 'Usuário visita tela inicial' do
  it 'e vê o nome da app' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: 'user1223@example.com',
      last_name: 'Last Name',
      cpf: '483.556.180-50',
      password: 'password1234567',
      role: true  
    )

    establishment = Establishment.create!(
      name: 'PastoPizza',
      social_name: 'PastoPizza',
      cnpj: '37.803.284/0001-64',
      full_address: '123 Main St',
      city: 'Anytown',
      state: 'ST',
      postal_code: '12345',
      email: 'establishment2558@example.com',
      phone_number: '1234567890',
      user: user
    )

    # Act
    sign_in user
    visit root_path

    # Assert
    expect(page).to have_content('PaLevá')
  end

  it 'e vê os restaurantes cadastrados' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: 'user1223@example.com',
      last_name: 'Last Name',
      cpf: '483.556.180-50',
      password: 'password1234567',
      role: true
    )

    establishment = Establishment.create!(
      name: 'PastoPizza',
      social_name: 'PastoPizza',
      cnpj: '37.803.284/0001-64',
      full_address: '123 Main St',
      city: 'Anytown',
      state: 'ST',
      postal_code: '12345',
      email: 'establishment2558@example.com',
      phone_number: '1234567890',
      user: user
    )

    # Act
    sign_in user
    visit root_path

    # Assert
    expect(page).not_to have_content('Não existem restaurantes cadastrados')
    expect(page).to have_content('PastoPizza')
    expect(page).to have_content('1234567890')
  end

  it 'e vê mensagem quando não há restaurantes' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: 'user1223@example.com',
      last_name: 'Last Name',
      cpf: '483.556.180-50',
      password: 'password1234567',
      role: true
    )

    # Act
    sign_in user
    visit root_path

    # Assert
    expect(page).to have_content('Novo Restaurante')
  end
end 