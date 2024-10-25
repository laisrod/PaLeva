require 'rails_helper'

RSpec.describe 'Registro de Estabelecimento pelo Usuário', type: :system do
  context 'ao visitar a página de registro' do
    it 'exibe o formulário de inscrição' do
      visit new_establishment_path
      expect(page).to have_content('New establishment')
    end
  end

  context 'ao enviar informações válidas' do
    it 'registra o estabelecimento com sucesso' do
      visit new_establishment_path
      fill_in 'Nome', with: 'My Establishment'
      fill_in 'Descrição', with: 'My Description'
      fill_in 'Endereço', with: '123 Main St'
      fill_in 'E-mail', with: 'owner@example.com'
      fill_in 'Código', with: 'EST123'
      fill_in 'Cidade', with: 'Sample City'
      fill_in 'Estado', with: 'Sample State'
      fill_in 'Código Postal', with: '12345'
      fill_in 'Telefone', with: '123-456-7890'
      fill_in 'Horário de Funcionamento', with: '9 AM - 5 PM'
      click_button 'Enviar'

      expect(page).to have_content('My Establishment')
      expect(page).to have_content('My Description')
      expect(page).to have_content('9 AM - 5 PM')
      expect(current_path).to eq(root_path)
    end
  end

  context 'ao enviar informações inválidas' do
    it 'mostra mensagens de erro' do
      visit new_establishment_path
      fill_in 'Nome', with: ''
      fill_in 'Descrição', with: ''
      fill_in 'Endereço', with: ''
      fill_in 'E-mail', with: 'invalid-email'
      fill_in 'Código', with: ''
      fill_in 'Cidade', with: ''
      fill_in 'Estado', with: ''
      fill_in 'Código Postal', with: ''
      fill_in 'Telefone', with: ''
      fill_in 'Horário de Funcionamento', with: ''
      click_button 'Enviar'

      expect(page).to have_content("Nome não pode ficar em branco")
      expect(page).to have_content("Horário de funcionamento não pode ficar em branco")
      expect(page).to have_content("Número de telefone não pode ficar em branco")
      expect(page).to have_content("Descrição não pode ficar em branco")
      expect(page).to have_content("Código não pode ficar em branco")
      expect(page).to have_content("Cidade não pode ficar em branco")
      expect(page).to have_content("Estado não pode ficar em branco")
      expect(page).to have_content("CEP não pode ficar em branco")
    end
  end
end
