require 'rails_helper'

RSpec.describe 'Cadastro de Porção', type: :system do 
  context 'quando tenta cadastrar uma nova porção' do
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
      dish = Dish.create!(
        name: 'Dish',
        description: 'Description',
        establishment_id: establishment.id
      )

      login_as(user)
      visit establishment_dishes_path(establishment)
      click_link 'Adicionar porção'

      expect(page).to have_content('Nova Porção')
      
      fill_in 'Descrição', with: 'Porção de batata frita crocante'
      fill_in 'Preço', with: '25.90'
      
      click_button 'Criar Porção'
      
      expect(page).to have_content('R$ 25,90')
      expect(page).to have_content('Porção de batata frita crocante')
    end
  end

  it 'e vê mensagens de erro quando dados são inválidos' do
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
    dish = Dish.create!(
      name: 'teste',
      description: 'Description',
      establishment_id: establishment.id
    )

    login_as(user)
    visit new_establishment_dish_portion_path(establishment, dish)	
    
    click_button 'Criar Porção'

    expect(page).to have_content('Description não pode ficar em branco')
    expect(page).to have_content('Price não pode ficar em branco')
  end
  it 'e vê historico de preços' do
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
      postal_code: '12345-678',
      email: 'establishment@test.com',
      phone_number: '(11) 98765-4321',
      user_id: user.id
    )
    
    dish = Dish.create!(
            name: 'teste',
            description: 'Description',
            establishment_id: establishment.id
    )
    portion = Portion.create!( price: '5', description: 'teste2', dish_id: dish.id )

    login_as(user)
    visit establishment_dish_path(establishment, dish)
    click_on 'Editar'
    fill_in 'Descrição', with: 'Porção de batata frita crocante'
    fill_in 'Preço', with: '10'
    click_button 'Atualizar Porção'

    expect(page).to have_content('Histórico de Preços')
    expect(page).to have_content('R$ 5,00')
    expect(page).to have_content('R$ 10,00')
    expect(page).not_to have_content('teste2')
  end
end
