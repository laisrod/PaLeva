require 'rails_helper'

describe 'Cadastro de Funcionário' do
  it 'com sucesso' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: 'user99913@example.com',
      last_name: 'Last Name',
      cpf: '483.556.180-50',
      password: 'password1234567'
    )

    establishment = Establishment.create!(
      name: 'Establishment',
      social_name: 'Establishment',
      cnpj: '47.761.353/0001-78',
      full_address: '123 Main St',
      city: 'Anytown',
      state: 'ST',
      postal_code: '12345',
      email: 'establishment9992@example.com',
      phone_number: '1234567890',
      user_id: user.id
    )

    # Act
    visit new_user_path(establishment_id: establishment.id)
    expect(page).to have_content('Cadastrar')
    
    within('nav') do
      click_link 'Cadastrar'
    end

    within('#new_user') do
      fill_in 'Nome', with: 'João Silva'
      fill_in 'Sobrenome', with: 'Silva'
      fill_in 'CPF', with: '483.556.180-50'
      fill_in 'E-mail', with: 'joao.silva@exemplo.com'
      fill_in 'Senha', with: 'teste123456789'
      fill_in 'Confirmar Senha', with: 'teste123456789'
    end

    click_button 'Cadastrar'

    # Assert
    expect(page).to have_content('Login efetuado com sucesso.')
    expect(User.last.name).to eq('João Silva')
    expect(User.last.email).to eq('joao.silva@exemplo.com')
  end

  it 'e vê mensagens de erro quando dados são inválidos' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: 'user663@example.com',
      last_name: 'Last Name',
      cpf: '483.556.180-50',
      password: 'password1234567'
    )

    establishment = Establishment.create!(
      name: 'Establishment',
      social_name: 'Establishment',
      cnpj: '16.424.880/0001-63',
      full_address: '123 Main St',
      city: 'Anytown',
      state: 'ST',
      postal_code: '12345',
      email: 'establishment662@example.com',
      phone_number: '1234567890',
      user_id: user.id
    )
    
    # Act
    visit new_user_registration_path(establishment_id: establishment.id)
    within('nav') do
      click_link 'Cadastrar'
    end
    click_button 'Cadastrar'

    # Assert
    expect(page).to have_content('Name não pode ficar em branco')
    expect(page).to have_content('Email não pode ficar em branco')
  end
end 