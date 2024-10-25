require 'rails_helper'

RSpec.describe 'Cadastro de Funcionário', type: :system do
    let(:user) { User.create(name: 'Admin RH', email: 'admin@exemplo.com', password_digest: 'senha123', role: 'hr') }
    let!(:establishment) do
        Establishment.create(
          name: 'Loja Exemplo',
          description: 'Descrição da Loja',
          full_address: 'Rua Exemplo, 123',
          email: 'loja@exemplo.com',
          code: 'LOJA123',
          city: 'Cidade Exemplo',
          state: 'Estado Exemplo',
          postal_code: '12345-678',
          phone_number: '(11) 1234-5678',
          opening_hours: '9h às 18h'
        )
      end  

    before do
        driven_by(:rack_test)
        login_as(user, scope: :user)
        visit new_user_path(establishment_id: establishment.id)
    end

    it 'permite que o RH cadastre um novo funcionário' do
        expect(page).to have_content('Novo Usuário')

        fill_in 'user[name]', with: 'João Silva'
        fill_in 'user[email]', with: 'joao.silva@exemplo.com'
        fill_in 'user[password]', with: '123456'
        fill_in 'user[password_confirmation]', with: '123456'
        select 'employee', from: 'user[role]'

        click_button 'Criar Usuário'

        expect(page).to have_content('Usuário criado com sucesso')
        expect(User.last.name).to eq('João Silva')
        expect(User.last.email).to eq('joao.silva@exemplo.com')
        expect(User.last.establishment).to eq(establishment)
    end

    it 'exibe mensagens de erro para entrada inválida' do
        click_button 'Criar Usuário'

        expect(page).to have_content('Nome não pode ficar em branco')
        expect(page).to have_content('E-mail não pode ficar em branco')
        expect(page).to have_content('Senha não pode ficar em branco')
    end
end
