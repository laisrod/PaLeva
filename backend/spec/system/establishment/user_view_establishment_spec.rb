require 'rails_helper'

describe 'Visualização de Estabelecimento' do
  it 'redireciona para cadastro de estabelecimento após criar conta' do
    visit new_user_registration_path
    
    within('#new_user') do
      fill_in 'user_name', with: 'João'
      fill_in 'user_last_name', with: 'Silva'
      fill_in 'user_cpf', with: '048.556.180-50'
      fill_in 'user_email', with: 'joao@example.com'
      fill_in 'user_password', with: 'password123456'
      fill_in 'user_password_confirmation', with: 'password123456'
      check 'user_role'
    end
    
    click_button 'Cadastrar'
    
    expect(User.count).to eq(1)
    expect(current_path).to eq(new_establishment_path)
  end

  it 'usuário vê detalhes de um estabelecimento' do
    owner = User.create!(
      name: 'João',
      last_name: 'Silva',
      cpf: '048.556.180-50',
      email: 'joao@example.com',
      password: 'password123456',
      role: true
    )

    establishment = Establishment.create!(
      name: 'Restaurante do João',
      social_name: 'Restaurante do João LTDA',
      cnpj: '78.288.042/0001-67',
      code: 'REST123',
      full_address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '01234-567',
      email: 'contato@restaurantedojoao.com',
      phone_number: '11999999999',
      user: owner
    )

    login_as(owner, scope: :user)
    visit establishment_path(establishment)

    expect(page).to have_content 'Restaurante do João'
    expect(page).to have_content 'Nome Fantasia: Restaurante do João LTDA'
    expect(page).to have_content 'CNPJ: 78.288.042/0001-67'
    expect(page).to have_content 'Cidade: São Paulo'
    expect(page).to have_content 'Endereço: Rua das Flores, 123'
    expect(page).to have_content 'Estado: SP'
    expect(page).to have_content 'CEP: 01234-567'
    expect(page).to have_content 'Email: contato@restaurantedojoao.com'
    expect(page).to have_content 'Telefone: 11999999999'
  end
end
