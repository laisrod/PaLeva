require 'rails_helper'

RSpec.describe 'Cliente cria um pedido', type: :system do
  it 'com sucesso' do
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
      name: 'X-Burger',
      description: 'teste',
      establishment: establishment
    )
    portion_dish = Portion.create!(description: 'Pequeno', price: 10.0, dish_id: dish.id)
    menu = Menu.create(
      name: 'Menu 1',
      description:'teste',
      establishment: establishment
    )
    menu_item_dish = MenuItem.create(
      menu: menu,
      dish: dish    
    )

    order = Order.create(
      establishment: establishment    )
    login_as(user)
    save_and_open_page  # Adicione esta linha

    visit establishment_order_path(establishment, order) # Altere para a rota correta
 
    
    click_link 'Adicionar Items'
    click_link 'Ver'
    click_link 'Adicionar ao Pedido'

    select 'Pequeno', from: 'order_menu_item[portion_id]'
    fill_in 'Quantidade', with: '2'
    click_button 'Adicionar ao Pedido'
    # Expectativas
    expect(page).to have_content 'X-Burger'
    expect(page).to have_content '2'
    expect(page).to have_content 'Status: Rascunho'
    expect(page).to have_content 'R$ 10,00'
  end

  it 'com dados incompletos' do
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
      name: 'X-Burger',
      description: 'teste',
      establishment: establishment
    )
    portion_dish = Portion.create!(description: 'Pequeno', price: 10.0, dish_id: dish.id)
    menu = Menu.create(
      name: 'Menu 1',
      description:'teste',
      establishment: establishment
    )
    menu_item_dish = MenuItem.create(
      menu: menu,
      dish: dish    
    )

    order = Order.create(
      establishment: establishment    )
    login_as(user)
    save_and_open_page  # Adicione esta linha
    
    visit establishment_order_path(establishment, order) # Altere para a rota correta
 
    
    click_link 'Adicionar Items'
    click_link 'Ver'
    click_link 'Adicionar ao Pedido'

    expect(page).to have_content 'É necessário informar um telefone ou email'
  end

  it 'com CPF inválido' do
    # Setup
    user = User.create!(
      name: 'User', 
      email: 'user99913@example.com', 
      last_name: 'Last Name', 
      cpf: '987.780.040-39', 
      password: 'password1234567'
    )
  
    establishment = Establishment.create!(
      name: 'Establishment', 
      social_name: 'Establishment', 
      cnpj: '27.806.491/0001-19', 
      full_address: '123 Main St', 
      city: 'Anytown', 
      state: 'ST', 
      postal_code: '12345', 
      email: 'establishment9992@example.com', 
      phone_number: '1234567890', 
      user_id: user.id
    )
  
    dish = Dish.create!(
      name: 'X-Burger',
      description: 'teste',
      establishment: establishment
    )
    
    portion_dish = Portion.create!(
      description: 'Pequeno', 
      price: 10.0, 
      dish_id: dish.id
    )
    
    menu = Menu.create!(
      name: 'Menu 1',
      description: 'teste',
      establishment: establishment
    )
    
    menu_item_dish = MenuItem.create!(
      menu: menu,
      dish: dish    
    )
  
    # Criar um pedido em status draft
    order = Order.create!(
      establishment: establishment,
      status: :draft
    )
  
    login_as(user)
    
    # Visitar a página do pedido
    visit establishment_order_path(establishment, order)
  
  # Debug para ver os campos disponíveis
  # puts page.html
  
  # Preencher usando os IDs corretos dos campos
  fill_in 'order_customer_name', with: 'João Silva'
  fill_in 'order_customer_email', with: 'joao@example.com'
  fill_in 'order_customer_cpf', with: '987.780.040-39'
  
  click_button 'Atualizar'
  
  # Expectativas
  expect(page).to have_content 'CPF inválido'
  expect(order.reload.status).to eq 'draft'
end
end