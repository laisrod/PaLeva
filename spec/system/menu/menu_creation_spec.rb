require 'rails_helper'

RSpec.describe 'Criação de Cardápio', type: :system do
  it 'usuário cria um novo cardápio com sucesso' do
    user = User.create!(
      name: 'User', 
      email: 'user99913@example.com', 
      last_name: 'Last Name', 
      cpf: '483.556.180-50', 
      password: 'testes123456',
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
    pao_queijo = Dish.create!(
      name: 'Pão de Queijo',
      description: 'Quentinho e fresquinho',
      status: true,
      calories: 150,
      establishment: establishment
    )
    
    cafe = Drink.create!(
      name: 'Café',
      description: 'Café coado na hora',
      status: true,
      calories: 5,
      establishment: establishment
    )

     # Act
     login_as(user)
     visit root_path
     click_on 'Ver Cardápio'
     click_on 'Novo Cardápio'
 
     fill_in 'Nome', with: 'Cardápio de Verão'
     fill_in 'Descrição', with: 'Pratos frescos para o verão'
     click_on 'Salvar'
     click_on 'Adicionar Item'
     select 'Pão de Queijo', from: 'menu_item_dish_id'
     click_on 'Salvar'
    expect(page).to have_content('Item adicionado com sucesso')
    expect(page).to have_content('Cardápio de Verão')
    expect(page).to have_content('Pratos frescos para o verão')
    expect(page).to have_content('Pão de Queijo')
  end
end 