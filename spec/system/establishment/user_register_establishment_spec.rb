require 'rails_helper'

describe 'Registro de Estabelecimento pelo Usuário' do

  it 'exibe formulário de inscrição' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: 'user223@example.com',
      last_name: 'Last Name',
      cpf: '483.556.180-50',
      password: 'password1234567',
      role: true
    )

    # Act
    sign_in user
    visit new_establishment_path

    # Assert
    expect(page).to have_content('Novo Restaurante')
    expect(page).to have_field('Nome Fantasia')
    expect(page).to have_field('Razão Social')
    expect(page).to have_field('CNPJ')
    expect(page).to have_button('Salvar')
  end

  it 'com sucesso' do
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
    fill_in 'establishment[name]', with: 'Novo estabelecimento'
    fill_in 'establishment[social_name]', with: 'Novo estabelecimento'
    fill_in 'establishment[cnpj]', with: '85.449.105/0001-85'
    fill_in 'establishment[full_address]', with: '123 Main St'
    fill_in 'establishment[email]', with: 'owner@example.com'
    fill_in 'establishment[postal_code]', with: 'EST123'
    fill_in 'establishment[city]', with: 'Sample City'
    fill_in 'establishment[state]', with: 'Sample State'
    fill_in 'establishment[phone_number]', with: '123-456-7890'
    click_button 'Salvar'

    # Assert
    expect(page).to have_content('Estabelecimento cadastrado com sucesso.')
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
      cpf: '757.423.510-46',
      role: true
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
    click_on 'Salvar'

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

  it 'e não consegue registrar com CNPJ duplicado' do
    # Arrange
    user = User.create!(
      email: 'user@example.com',
      password: '123456789012',
      name: 'João',
      last_name: 'Silva',
      cpf: '860.392.110-59',
      role: true
    )

    another_user = User.create!(
      email: 'another@example.com',
      password: '123456789012',
      name: 'Maria',
      last_name: 'Silva',
      cpf: '171.853.820-04',
      role: true
    )

    Establishment.create!(
      name: 'Restaurante Existente',
      social_name: 'Restaurante Existente LTDA',
      cnpj: '85.449.105/0001-85',
      full_address: '123 Main St',
      city: 'Sample City',
      state: 'Sample State',
      postal_code: 'EST123',
      email: 'existing@example.com',
      phone_number: '123-456-7890',
      user: another_user
    )

    # Act
    login_as(user)
    visit new_establishment_path
    fill_in 'Nome Fantasia', with: 'Novo Restaurante'
    fill_in 'Razão Social', with: 'Novo Restaurante LTDA'
    fill_in 'CNPJ', with: '85.449.105/0001-85'
    fill_in 'Endereço', with: 'Rua das Flores, 123'
    fill_in 'Cidade', with: 'São Paulo'
    fill_in 'Estado', with: 'SP'
    fill_in 'Código Postal', with: '01234-567'
    fill_in 'E-mail', with: 'novo@example.com'
    fill_in 'Telefone', with: '11-98765-4321'
    click_on 'Salvar'

    # Assert
    expect(page).to have_content('Cnpj já está em uso')
    expect(page).to have_content('Estabelecimento não cadastrado.')
    expect(Establishment.count).to eq 1
  end

  it 'e não consegue registrar sem estar autenticado' do
    # Act
    visit new_establishment_path
  end
end
