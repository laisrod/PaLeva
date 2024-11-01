require 'rails_helper'

RSpec.describe 'Remover Usuário do Estabelecimento', type: :system do
  include Devise::Test::IntegrationHelpers


  context 'ao visitar a página de detalhes do estabelecimento' do
    it 'exibe o botão remover' do
      user = User.create!(name: 'User', email: 'user13523@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
      establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '78.288.042/0001-67', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2523@example.com', phone_number: '1234567890', user_id: user.id)
      sign_in user
      visit establishment_path(establishment)
      expect(page).to have_link('Remover Estabelecimento')
    end
  end

  context 'ao remover um estabelecimento' do
    it 'remove o estabelecimento com sucesso' do
      user = User.create!(name: 'User', email: 'user15523@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
      establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '37.803.284/0001-64', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2558@example.com', phone_number: '1234567890', user_id: user.id)
      sign_in user
      visit establishment_path(establishment)
      click_link 'Remover Estabelecimento'

      expect(page).to have_content('Estabelecimento removido com sucesso')
      expect(current_path).to eq('/establishments/new')
      expect(page).not_to have_content('Test Establishment')
    end
  end

  context 'ao tentar remover um estabelecimento inexistente' do
    it 'mostra uma mensagem de erro' do
      user = User.create!(name: 'User', email: 'user14563@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
      establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '28.118.550/0001-29', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2456@example.com', phone_number: '1234567890', user_id: user.id)
      sign_in user

      non_existent_id = Establishment.maximum(:id).to_i + 1
      visit establishment_path(non_existent_id)

      expect(page).to have_content('Estabelecimento não encontrado')
    end
  end

  context 'ao cancelar a remoção' do
    it 'não remove o estabelecimento' do
      user = User.create!(name: 'User', email: 'user13777@example.com', last_name: 'Last Name', cpf: '483.556.180-50', password: 'password1234567')
      establishment = Establishment.create!(name: 'Establishment', social_name: 'Establishment', cnpj: '97.339.209/0001-16', full_address: '123 Main St', city: 'Anytown', state: 'ST', postal_code: '12345', email: 'establishment2777@example.com', phone_number: '1234567890', user_id: user.id)
      sign_in user
      visit establishment_path(establishment)
      
    end
  end
end

