require 'rails_helper'

describe 'Registro de Estabelecimento pelo Usuário' do

  it 'exibe formulário de inscrição' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: 'user223@example.com',
      last_name: 'Last Name',
      cpf: '483.556.180-50',
      password: 'password1234567'
    )

    # Act
    sign_in user
    visit new_establishment_path

    # Assert
    expect(page).to have_content('Novo Restaurante')
  end

  it 'com sucesso' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: 'user1223@example.com',
      last_name: 'Last Name',
      cpf: '483.556.180-50',
      password: 'password1234567'
    )

    # Act
    sign_in user
    visit root_path
    fill_in 'establishment[name]', with: 'Novo estabelecimento'
    fill_in 'establishment[social_name]', with: 'Novo estabelecimento'
    fill_in 'establishment[cnpj]', with: '85.449.105/0001-85'
    fill_in 'establishment[full_address]', with: '123 Main St'
    fill_in 'establishment[email]', with: 'owner@example.com'
    fill_in 'establishment[postal_code]', with: 'EST123'
    fill_in 'establishment[city]', with: 'Sample City'
    fill_in 'establishment[state]', with: 'Sample State'
    fill_in 'establishment[phone_number]', with: '123-456-7890'
    click_button 'Enviar'

    # Assert
    expect(page).to have_content('Novo estabelecimento')
    expect(current_path).to eq(root_path)
  end

  it 'e vê mensagens de erro quando dados são inválidos' do
    # Arrange
    user = User.create!(
      email: 'user122223@example.com',
      password: '123456789012',
      name: 'João',
      last_name: 'Silva',
      cpf: '757.423.510-46'
    )

    # Act
    login_as(user)
    visit new_establishment_path
    fill_in 'Nome Fantasia', with: ''
    fill_in 'Razão Social', with: ''
    fill_in 'CNPJ', with: ''
    fill_in 'Endereço', with: ''
    fill_in 'Cidade', with: ''
    fill_in 'Estado', with: ''
    fill_in 'Código Postal', with: ''
    fill_in 'E-mail', with: ''
    fill_in 'Telefone', with: ''
    click_on 'Enviar'

    # Assert
    expect(page).to have_content('Estabelecimento não cadastrado.')
    expect(page).to have_content('Name não pode ficar em branco')
    expect(page).to have_content('Social name não pode ficar em branco')
    expect(page).to have_content('Cnpj não pode ficar em branco')
    expect(page).to have_content('Full address não pode ficar em branco')
    expect(page).to have_content('City não pode ficar em branco')
    expect(page).to have_content('State não pode ficar em branco')
    expect(page).to have_content('Postal code não pode ficar em branco')
    expect(page).to have_content('Phone number não pode ficar em branco')
    expect(page).to have_content('Email não é válido')
    expect(page).to have_content('Cnpj inválido')
  end
end
