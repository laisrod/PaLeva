require 'rails_helper'

RSpec.describe 'Gerenciamento de Bebidas', type: :system do
  include Devise::Test::IntegrationHelpers

  context 'cadastro de bebidas' do
    it 'cadastra uma bebida não alcoólica com sucesso' do
      user = User.create!(name: 'User', email: "user#{Time.now.to_i}@example.com", 
                         password: 'password1230', last_name: 'Last Name', 
                         cpf: '483.556.180-50')

      establishment = Establishment.create!(name: 'Meu Restaurante', 
                                         social_name: 'Restaurante LTDA',
                                         cnpj: '39.513.250/0001-60', 
                                         full_address: 'Rua Principal, 123',
                                         city: 'São Paulo', state: 'SP', 
                                         postal_code: '12345-678',
                                         email: "contato#{Time.now.to_i}@restaurante.com",
                                         phone_number: '11999999999', user: user)
      
      sign_in user
      visit new_establishment_drink_path(establishment)

      fill_in 'Nome', with: 'Suco de Laranja'
      fill_in 'Descrição', with: 'Suco natural da fruta'
      fill_in 'Calorias', with: '45'
      uncheck 'Alcoólica?'
      
      click_on 'Criar Bebida'

      expect(page).to have_content('Drink was successfully created.')
      expect(page).to have_content('Suco de Laranja')
      expect(page).to have_content('45')
      expect(page).to have_content('Alcoólica: Não')
    end

    it 'cadastra uma bebida alcoólica com sucesso' do
      user = User.create!(name: 'User', email: "user#{Time.now.to_i}@example.com", 
                         password: 'password1230', last_name: 'Last Name', 
                         cpf: '483.556.180-50')

      establishment = Establishment.create!(name: 'Meu Restaurante', 
                                         social_name: 'Restaurante LTDA',
                                         cnpj: '58.055.462/0001-96', 
                                         full_address: 'Rua Principal, 123',
                                         city: 'São Paulo', state: 'SP', 
                                         postal_code: '12345-678',
                                         email: "contato#{Time.now.to_i}@restaurante.com",
                                         phone_number: '11999999999', user: user)
      
      sign_in user
      visit new_establishment_drink_path(establishment)

      fill_in 'Nome', with: 'Cerveja IPA'
      fill_in 'Descrição', with: 'Cerveja artesanal'
      check 'Alcoólica?'
      
      click_on 'Criar Bebida'

      expect(page).to have_content('Drink was successfully created.')
      expect(page).to have_content('Cerveja IPA')
      expect(page).to have_content('Alcoólica: Sim')
    end

    it 'falha ao Criar bebida sem nome' do
      user = User.create!(name: 'User', email: "user#{Time.now.to_i}@example.com", 
      password: 'password22221230', last_name: 'Last Name', 
      cpf: '483.556.180-50')

establishment = Establishment.create!(name: 'Meu Restaurante', 
                      social_name: 'Restaurante LTDA',
                      cnpj: '58.055.462/0001-96', 
                      full_address: 'Rua Principal, 123',
                      city: 'São Paulo', state: 'SP', 
                      postal_code: '12345-678',
                      email: "contato#{Time.now.to_i}@restaurante.com",
                      phone_number: '11999999999', user: user)
      
      sign_in user
      visit new_establishment_drink_path(establishment)

      fill_in 'Nome', with: ''
      fill_in 'Descrição', with: 'Descrição'
      click_on 'Criar Bebida'

      expect(page).to have_content('Name não pode ficar em branco')
    end
  end

  context 'visualização de bebidas' do
    it 'lista apenas bebidas do próprio estabelecimento' do
      user = User.create!(
        name: 'User',
        email: "user#{Time.now.to_i}@example.com",
        password: 'password123055555',
        last_name: 'Last Name',
        cpf: '483.556.180-50'
      )

      establishment = Establishment.create!(
        name: 'Meu Restaurante',
        social_name: 'Restaurante LTDA',
        cnpj: '39.513.250/0001-60',
        full_address: 'Rua Principal, 123',
        city: 'São Paulo',
        state: 'SP',
        postal_code: '12345-678',
        email: "contato#{Time.now.to_i}@restaurante.com",
        phone_number: '11999999999',
        user: user
      )

      # Cria bebida do próprio estabelecimento
      Drink.create!(
        name: 'Minha Bebida',
        description: 'Descrição',
        alcoholic: false,
        establishment: establishment
      )

      # Cria outro estabelecimento com bebida
      outro_establishment = Establishment.create!(
        name: 'Outro Restaurante',
        social_name: 'Outro LTDA',
        cnpj: '91.124.576/0001-16',
        full_address: 'Outra Rua, 321',
        city: 'Rio de Janeiro',
        state: 'RJ',
        postal_code: '98765-432',
        email: 'outro@restaurante.com',
        phone_number: '11988888888',
        user: User.create!(
          name: 'Outro',
          email: 'outro@example.com',
          password: 'senha1255522523',
          last_name: 'User',
          cpf: '269.738.280-19'
        )
      )

      Drink.create!(
        name: 'Bebida de Outro',
        description: 'Outra descrição',
        alcoholic: true,
        establishment: outro_establishment
      )
      sign_in user
      visit establishment_drinks_path(establishment)

      expect(page).to have_content('Minha Bebida')
      expect(page).not_to have_content('Bebida de Outro')
    end
  end

  context 'edição de bebidas' do
    it 'edita uma bebida com sucesso' do
      user = User.create!(name: 'User', email: "user#{Time.now.to_i}@example.com", 
                         password: 'password1230', last_name: 'Last Name', 
                         cpf: '483.556.180-50')

      establishment = Establishment.create!(name: 'Meu Restaurante', 
                                         social_name: 'Restaurante LTDA',
                                         cnpj: '39.513.250/0001-60', 
                                         full_address: 'Rua Principal, 123',
                                         email: "contato#{Time.now.to_i}@restaurante.com",
                                         phone_number: '11999999999', user: user, city: 'São Paulo', state: 'SP', postal_code: '12345-678')

      bebida = Drink.create!(
        name: 'Bebida Original',
        description: 'Descrição Original',
        alcoholic: false,
        establishment: establishment
      )

      sign_in user
      visit edit_establishment_drink_path(establishment, bebida)

      fill_in 'Nome', with: 'Bebida Atualizada'
      fill_in 'Descrição', with: 'Nova Descrição'
      fill_in 'Calorias', with: '100'
      check 'Alcoólica?'
      
      click_on 'Atualizar Bebida'

      expect(page).to have_content('Bebida atualizada com sucesso')
      expect(page).to have_content('Bebida Atualizada')
      expect(page).to have_content('Calorias: 100')
      expect(page).to have_content('Alcoólica: Sim')
    end
  end

  context 'remoção de bebidas' do
    it 'remove uma bebida com sucesso' do
      user = User.create!(name: 'User', email: "user#{Time.now.to_i}@example.com", 
      password: 'password1230', last_name: 'Last Name', 
      cpf: '483.556.180-50')

      establishment = Establishment.create!(name: 'Meu Restaurante', 
                      social_name: 'Restaurante LTDA',
                      cnpj: '39.513.250/0001-60', 
                      full_address: 'Rua Principal, 123',
                      email: "contato#{Time.now.to_i}@restaurante.com",
                      phone_number: '11999999999', user: user, city: 'São Paulo', state: 'SP', postal_code: '12345-678')


                      
      bebida = Drink.create!(
        name: 'Bebida para Remover',
        description: 'Será removida',
        alcoholic: false,
        establishment: establishment
      )
      sign_in user
      visit establishment_drink_path(establishment, bebida)
      within '.button_to' do
        click_on 'Remover Bebida'
      end

      expect(page).to have_content('Bebida excluída com sucesso')
      expect(page).not_to have_content('Bebida para Remover')
    end
  end
end 