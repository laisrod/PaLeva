require 'rails_helper'
require 'cpf_cnpj'

RSpec.describe 'Cliente cria um pedido', type: :system do
  it 'com sucesso' do
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
    establishment: establishment    
    )

    login_as(user)
    save_and_open_page

    visit establishment_order_path(establishment, order)
 
    
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
    # Setup
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

    order = Order.create!(establishment: establishment, status: :draft)
    
    login_as user
    visit establishment_order_path(establishment, order)
    
    within '#update-order-form' do
      fill_in 'Nome:', with: 'João'
      fill_in 'Email:', with: ''
      fill_in 'CPF:', with: '260.405.490-68'
      click_button 'Atualizar'
    end
    
    expect(page).to have_content 'É necessário informar um telefone ou email'
  end

  it 'com email preenchido' do
    # Setup
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

    order = Order.create!(establishment: establishment, status: :draft)
    
    login_as user
    visit establishment_order_path(establishment, order)
    
    within '#update-order-form' do
      fill_in 'Nome:', with: 'João'
      fill_in 'Email:', with: 'joao@email.com'
      fill_in 'CPF:', with: '260.405.490-68'
      click_button 'Atualizar'
    end
    
    expect(page).to have_content 'Pedido atualizado com sucesso'
  end

  it 'com CPF inválido' do
    # Setup
    user = User.create!(
        name: 'User', 
        email: 'user99913@example.com', 
        last_name: 'Last Name', 
        cpf: '084.734.580-79', 
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

    order = Order.create!(establishment: establishment, status: :draft)
    
    login_as user
    visit establishment_order_path(establishment, order)
    
    within '#update-order-form' do
      fill_in 'Nome:', with: 'João'
      fill_in 'Email:', with: 'joao@email.com'
      fill_in 'CPF:', with: '000.000.000-00'
      click_button 'Atualizar'
    end
    
    expect(page).to have_content 'Customer cpf inválido'
  end

  it 'sem CPF' do
    # Setup
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

    order = Order.create!(establishment: establishment, status: :draft)
    
    login_as user
    visit establishment_order_path(establishment, order)
    
    within '#update-order-form' do
      fill_in 'Nome:', with: 'João'
      fill_in 'Email:', with: 'joao@email.com'
      fill_in 'CPF:', with: ''
      click_button 'Atualizar'
    end
    
    expect(page).to have_content 'Pedido atualizado com sucesso'
  end
end