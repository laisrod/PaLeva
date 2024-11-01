require 'rails_helper'

RSpec.describe 'Editar Estabelecimento', type: :system do
  include Devise::Test::IntegrationHelpers

  context 'ao visitar a página de edição' do
    it 'exibe o formulário de edição' do
      user = User.create!(name: 'User', email: 'user13588@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
      establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '85.661.749/0001-32', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2588@example.com', phone_number: '1234567890', user_id: user.id)
      sign_in user
  
      visit edit_establishment_path(establishment)
      expect(page).to have_content('Editar Restaurante')
    end
  end

  context 'ao enviar informações válidas' do
    it 'atualiza o estabelecimento com sucesso' do
      user = User.create!(name: 'User', email: 'user1358888@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
      establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '47.422.118/0001-71', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment258888@example.com', phone_number: '1234567890', user_id: user.id)
      sign_in user
      visit edit_establishment_path(establishment)

      fill_in 'Nome Fantasia', with: 'Novo Nome'
      fill_in 'Endereço', with: 'Novo Endereço'
      fill_in 'E-mail', with: 'novo@exemplo.com'
      click_button 'Enviar'

      expect(page).to have_content('Estabelecimento atualizado com sucesso.')
      expect(page).to have_content('Novo Nome')
      expect(page).to have_content('Novo Endereço')
      expect(page).to have_content('novo@exemplo.com')
    end

    it 'mostra erro ao tentar editar com dados inválidos' do
      user = User.create!(name: 'User', email: 'user13741@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
      establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '66.857.685/0001-03', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2741@example.com', phone_number: '1234567890', user_id: user.id)
  
      sign_in user
      visit edit_establishment_path(establishment)
      fill_in 'Nome', with: ''
      fill_in 'Endereço', with: ''
      fill_in 'E-mail', with: ''
      click_button 'Enviar'

      expect(page).to have_content('Nome não pode ficar em branco')
      expect(page).to have_content('Full address não pode ficar em branco')
      expect(page).to have_content('Email não pode ficar em branco')
    end
  end

  context 'ao cancelar a edição' do
    it 'cancela a edição e retorna para a página de exibição do estabelecimento' do
      user = User.create!(name: 'User', email: 'user13555@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
      establishment = Establishment.create!(name: 'Nome Antigo', social_name: 'Establishment', cnpj: '95.510.373/0001-19', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2555@example.com', phone_number: '1234567890', user_id: user.id)
  
      sign_in user
      visit edit_establishment_path(establishment)
      click_link 'Voltar'

      expect(current_path).to eq(establishments_path)
      expect(page).to have_content('Nome Antigo')
    end
  end
end