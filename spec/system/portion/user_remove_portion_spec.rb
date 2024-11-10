require 'rails_helper'

RSpec.describe 'Remoção de Porção', type: :system do 
  context 'quando tenta remover uma porção' do
    it 'permite que remova com sucesso' do
      user = User.create!(
        name: 'User', 
        email: 'user99913@example.com', 
        last_name: 'Last Name', 
        cpf: '483.556.180-50', 
        password: 'password1234567',
        role: true
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
        user: user
      )
      dish = Dish.create!(
        name: 'Dish',
        description: 'Description',
        establishment_id: establishment.id
      )
      portion = Portion.create!(
        price: '25.90',
        description: 'Porção de batata frita crocante',
        dish_id: dish.id
      )

      login_as(user)
      visit establishment_dishes_path(establishment)
      click_button 'Remover'

      expect(page).not_to have_content('R$ 25,90')
      expect(page).not_to have_content('Porção de batata frita crocante')
      expect(Portion.count).to eq(0)
    end


    it 'não permite que usuário não autorizado remova porção' do
      user = User.create!(
        name: 'User', 
        email: 'user99913@example.com', 
        last_name: 'Last Name', 
        cpf: '033.021.570-10', 
        password: '003302157010',
        role: true
      )

      establishment = Establishment.create!(
        name: 'Establishment', 
        social_name: 'Establishment', 
        cnpj: '76.930.681/0001-59', 
        full_address: '123 Main St', 
        city: 'Anytown', 
        state: 'ST', 
        postal_code: '12345', 
        email: 'establishment9992@example.com', 
        phone_number: '1234567890', 
        user: user
      )

      dish = Dish.create!(
        name: 'Dish',
        description: 'Description',
        establishment_id: establishment.id
      )
      
      portion = Portion.create!(
        price: '25.90',
        description: 'Porção de batata frita crocante',
        dish_id: dish.id
      )

      outro_user = User.create!(
        name: 'Outro', 
        email: 'outro@example.com', 
        last_name: 'Usuario', 
        cpf: '118.338.120-42', 
        password: '118338120422',
        role: true
      )

      login_as(outro_user)
      visit establishment_dishes_path(establishment)
      
      expect(page).not_to have_button('Remover Porção')
    end

    it 'exibe confirmação antes de remover a porção' do
      user = User.create!(
        name: 'User', 
        email: 'user99913@example.com', 
        last_name: 'Last Name', 
        cpf: '483.556.180-50', 
        password: 'password1234567',
        role: true
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
        user: user
      )

      dish = Dish.create!(
        name: 'Dish',
        description: 'Description',
        establishment_id: establishment.id
      )
      
      portion = Portion.create!(
        price: '25.90',
        description: 'Porção de batata frita crocante',
        dish_id: dish.id
      )

      login_as(user)
      visit establishment_dishes_path(establishment)
      
      expect(page).to have_button('Remover')
    end
  end
end