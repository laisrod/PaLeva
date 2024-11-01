require 'rails_helper'

RSpec.describe 'Registro de Estabelecimento pelo Usuário', type: :system do
  include Devise::Test::IntegrationHelpers

  context 'ao visitar a página de registro' do
    it 'exibe o formulário de inscrição' do
      user = User.create!(name: 'User', email: 'user223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')

      sign_in user
      # Act
      visit new_establishment_path
      expect(page).to have_content('Novo Restaurante')
    end
  end

  context 'ao enviar informações válidas' do
    it 'registra o estabelecimento com sucesso' do
      user = User.create!(name: 'User', email: 'user1223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')

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
      # puts page.html
      click_button 'Enviar'
      save_and_open_page
      expect(page).to have_content('Novo estabelecimento')
      expect(current_path).to eq(root_path)
    end
  end

  context 'ao enviar informações inválidas' do
    it 'mostra mensagens de erro' do
      user = User.create!(name: 'User', email: 'user122223@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')

      sign_in user
      visit new_establishment_path
      fill_in 'Nome', with: ''
      fill_in 'Endereço', with: ''
      fill_in 'E-mail', with: 'invalid-email'
      fill_in 'Código', with: ''
      fill_in 'Cidade', with: ''
      fill_in 'Estado', with: ''
      fill_in 'Código Postal', with: ''
      fill_in 'Telefone', with: ''
      click_button 'Enviar'

      expect(page).to have_content("Nome não pode ficar em branco")
      expect(page).to have_content("Número de telefone não pode ficar em branco")
      expect(page).to have_content("Cidade não pode ficar em branco")
      expect(page).to have_content("Estado não pode ficar em branco")
      expect(page).to have_content("CEP não pode ficar em branco")
    end
  end
end
