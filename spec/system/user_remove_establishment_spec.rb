require 'rails_helper'

RSpec.describe 'Remover Usuário do Estabelecimento', type: :system do
  let!(:establishment) do
    Establishment.create!(
      name: 'Test Establishment',
      description: 'Test Description',
      full_address: '123 Test St',
      email: 'test@example.com',
      code: 'TEST123',
      city: 'Test City',
      state: 'Test State',
      postal_code: '12345',
      phone_number: '123-456-7890',
      opening_hours: '9 AM - 5 PM'
    )
  end

  context 'ao visitar a página de detalhes do estabelecimento' do
    it 'exibe o botão remover' do
      visit establishment_path(establishment)
      expect(page).to have_button('Remover Estabelecimento')
    end
  end

  context 'ao remover um estabelecimento' do
    it 'remove o estabelecimento com sucesso' do
      visit establishment_path(establishment)
      click_button 'Remover Estabelecimento'

      expect(page).to have_content('Estabelecimento removido com sucesso')
      expect(current_path).to eq(root_path)
      expect(page).not_to have_content('Test Establishment')
    end
  end

  context 'ao tentar remover um estabelecimento inexistente' do
    it 'mostra uma mensagem de erro' do
      non_existent_id = Establishment.maximum(:id).to_i + 1
      visit establishment_path(non_existent_id)

      expect(page).to have_content('Estabelecimento não encontrado')
    end
  end

  context 'ao cancelar a remoção' do
    it 'não remove o estabelecimento' do
      visit establishment_path(establishment)
      
    end
  end
end

