require 'rails_helper'

describe 'Editar Estabelecimento' do

  it 'exibe formulário de edição' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: 'user13588@example.com',
      last_name: 'Last Name',
      cpf: '600.941.170-04',
      password: 'password1234567',
      role: true
    )

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
      user: user
    )

    # Act 
    sign_in user
    visit edit_establishment_path(establishment)

    # Assert 
    expect(page).to have_content('Editar Restaurante')
  end

  it 'com sucesso' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: 'user1358888@example.com',
      last_name: 'Last Name',
      cpf: '455.006.230-44',
      password: 'password1234567',
      role: true
    )

    establishment = Establishment.create!(
      name: 'Establishment',
      social_name: 'Establishment',
      cnpj: '47.422.118/0001-71',
      full_address: '123 Main St',
      city: 'Anytown',
      state: 'ST',
      postal_code: '12345',
      email: 'establishment258888@example.com',
      phone_number: '1234567890',
      user: user
    )

    # Act
    sign_in user
    visit edit_establishment_path(establishment)
    fill_in 'Nome Fantasia', with: 'Novo Nome'
    fill_in 'Endereço', with: 'Novo Endereço'
    fill_in 'E-mail', with: 'novo@exemplo.com'
    click_button 'Salvar'

    # Assert
    expect(page).to have_content('Estabelecimento atualizado com sucesso.')
    expect(page).to have_content('Novo Nome')
    expect(page).to have_content('Novo Endereço')
    expect(page).to have_content('novo@exemplo.com')
  end

  it 'e vê mensagens de erro quando dados são inválidos' do
    # Arrange
    user = User.create!(
      name: 'Ana',
      email: 'user13741@example.com',
      last_name: 'Last Name',
      cpf: '757.423.510-46',
      password: 'password1234567',
      role: true
    )
    establishment = Establishment.create!(
      name: 'Bar do João',
      cnpj: '91.883.071/0001-35',
      social_name: 'Bar do João LTDA',
      full_address: 'Rua do João, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '12345678',
      email: 'joao@bar.com',
      phone_number: '11999999999',
      user: user
    )

    # Act
    login_as(user)
    visit edit_establishment_path(establishment)
    fill_in 'Nome Fantasia', with: ''
    fill_in 'Endereço', with: ''
    fill_in 'E-mail', with: ''
    click_button 'Salvar'

    # Assert
    expect(page).to have_content('Não foi possivel atualizar o restaurante.')
    expect(page).to have_content('Name não pode ficar em branco')
    expect(page).to have_content('Full address não pode ficar em branco')
    expect(page).to have_content('Email não pode ficar em branco')
    expect(page).to have_content('Email não é válido')
  end

  it 'e cancela edição voltando para listagem' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: 'user13555@example.com',
      last_name: 'Last Name',
      cpf: '293.940.010-50',
      password: 'password1234567',
      role: true
    )

    establishment = Establishment.create!(
      name: 'Nome Antigo',
      social_name: 'Establishment',
      cnpj: '95.510.373/0001-19',
      full_address: '123 Main St',
      city: 'Anytown',
      state: 'ST',
      postal_code: '12345',
      email: 'establishment2555@example.com',
      phone_number: '1234567890',
      user: user
    )

    # Act
    sign_in user
    visit edit_establishment_path(establishment)
    click_link 'Voltar'

    # Assert
    expect(current_path).to eq(establishments_path)
    expect(page).to have_content('Nome Antigo')
  end
end