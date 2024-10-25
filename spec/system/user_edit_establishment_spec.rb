require 'rails_helper'

RSpec.describe 'Editar Estabelecimento', type: :system do
  let!(:establishment) do
    Establishment.create(
      name: 'Old Name',
      description: 'Old Description',
      full_address: 'Old full',
      email: 'old@example.com',
      code: 'OLD123',
      city: 'Old City',
      state: 'Old State',
      postal_code: '54321',
      phone_number: '987-654-3210',
      opening_hours: '8 AM - 4 PM'
    )
  end

  context 'ao visitar a página de edição' do
    it 'displays the edit form' do
      visit edit_establishment_path(establishment)
      expect(page).to have_content('Editar Estabelecimento')
    end
  end

  context 'ao enviar informações válidas' do
    it 'updates the establishment successfully' do
      visit edit_establishment_path(establishment)
      fill_in 'Nome', with: 'Novo Nome'
      fill_in 'Descrição', with: 'Nova Descrição'
      fill_in 'Endereço', with: 'Novo Endereço'
      fill_in 'E-mail', with: 'new@example.com'
      click_button 'Enviar'

      expect(page).to have_content('Estabelecimento atualizado com sucesso.')
      expect(page).to have_content('Novo Nome')
      expect(page).to have_content('Nova Descrição')
    end

    it 'shows error when trying to edit with invalid data' do
      visit edit_establishment_path(establishment)
      fill_in 'Nome', with: ''
      fill_in 'Descrição', with: ''
      fill_in 'Endereço', with: ''
      fill_in 'E-mail', with: ''
      click_button 'Enviar'

      expect(page).to have_content("Nome não pode ficar em branco")
      expect(page).to have_content("Descrição não pode ficar em branco")
    end
  end

  context 'ao cancelar a edição' do
    it 'cancela a edição e retorna para a página de exibição do estabelecimento' do
      visit edit_establishment_path(establishment)
      click_link 'Voltar'

      expect(current_path).to eq(establishments_path)
      expect(page).to have_content('Old Name')
      expect(page).to have_content('Old Description')
    end
  end
end