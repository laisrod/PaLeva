require 'rails_helper'

RSpec.describe 'Cadastro de Funcionário', type: :system do 

  context 'quando tenta cadastrar um novo funcionário' do
    it 'permite que cadastre com sucesso' do
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

      visit root_path

      click_link 'Criar conta'

      expect(page).to have_content('Cadastre-se')
      
      fill_in 'Nome', with: 'Jane'
      fill_in 'Sobrenome', with: 'Doe'
      fill_in 'CPF', with: '529.982.247-25'
      fill_in 'E-mail', with: 'jane@doe.com.br'
      fill_in 'Senha', with: 'password123456'
      fill_in 'Confirmar Senha', with: 'password123456'
      
      click_button 'Cadastrar'
      
      expect(page).to have_content('Login efetuado com sucesso')
    end
  end

  it 'e vê mensagens de erro quando dados são inválidos' do
    visit new_user_registration_path

    fill_in 'Nome', with: ''
    fill_in 'Sobrenome', with: ''
    fill_in 'CPF', with: ''
    fill_in 'E-mail', with: ''
    fill_in 'Senha', with: ''
    fill_in 'Confirmar Senha', with: ''
    click_button 'Cadastrar'

    expect(page).to have_content('Nome não pode ficar em branco')
    expect(page).to have_content('Sobrenome não pode ficar em branco')
    expect(page).to have_content('CPF não pode ficar em branco')
    expect(page).to have_content('CPF inválido')
    expect(page).to have_content('E-mail não pode ficar em branco')
    expect(page).to have_content('Password não pode ficar em branco')
  end
end
