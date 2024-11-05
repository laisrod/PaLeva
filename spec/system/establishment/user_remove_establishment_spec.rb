require 'rails_helper'

describe 'Usuário remove um estabelecimento' do

  it 'com sucesso' do
    # Arrange
    user = User.create!(
      name: 'User', 
      email: 'user15523@example.com', 
      last_name: 'Last Name', 
      cpf: '483.556.180-50', 
      password: 'password1234567'
    )
    
    establishment = Establishment.create!(
      name: 'Establishment Test', 
      social_name: 'Establishment', 
      cnpj: '37.803.284/0001-64', 
      full_address: '123 Main St', 
      city: 'Anytown', 
      state: 'ST', 
      postal_code: '12345', 
      email: 'establishment2558@example.com', 
      phone_number: '1234567890', 
      user_id: user.id
    )

    # Act
    sign_in user
    visit establishment_path(establishment)
    click_link 'Remover Estabelecimento'

    # Assert
    expect(page).to have_content('Estabelecimento removido com sucesso')
    expect(current_path).to eq('/establishments/new')
    expect(page).not_to have_content('Establishment Test')
  end

  it 'e não encontra estabelecimento inexistente' do
    # Arrange
    user = User.create!(
      name: 'User', 
      email: 'user14563@example.com', 
      last_name: 'Last Name', 
      cpf: '483.556.180-50', 
      password: 'password1234567'
    )

    # Act
    sign_in user
    non_existent_id = Establishment.maximum(:id).to_i + 1
    visit establishment_path(non_existent_id)

    # Assert
    expect(page).to have_content('Estabelecimento não encontrado')
  end

  it 'e visualiza botão de remover' do
    # Arrange
    user = User.create!(
      name: 'User', 
      email: 'user13523@example.com', 
      last_name: 'Last Name', 
      cpf: '483.556.180-50', 
      password: 'password1234567'
    )
    
    establishment = Establishment.create!(
      name: 'Establishment', 
      social_name: 'Establishment', 
      cnpj: '78.288.042/0001-67', 
      full_address: '123 Main St', 
      city: 'Anytown', 
      state: 'ST', 
      postal_code: '12345', 
      email: 'establishment2523@example.com', 
      phone_number: '1234567890', 
      user_id: user.id
    )

    # Act
    sign_in user
    visit establishment_path(establishment)

    # Assert
    expect(page).to have_link('Remover Estabelecimento')
  end
end

