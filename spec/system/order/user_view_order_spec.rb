require 'rails_helper'

RSpec.describe 'Visualização de Pedido', type: :system do
  include Devise::Test::IntegrationHelpers

  it 'usuário vê detalhes de um pedido com itens' do
    proprietario = User.create!(
      name: 'João',
      last_name: 'Silva',
      cpf: '747.356.180-50',
      email: 'joao@example.com',
      password: 'password123456',
      role: true
    )

    establishment = Establishment.create!(
      name: 'Restaurante do João',
      social_name: 'Restaurante do João LTDA',
      cnpj: '78.288.042/0001-67',
      code: 'REST123',
      full_address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '01234-567',
      email: 'contato@restaurantedojoao.com',
      phone_number: '11999999999',
      user: proprietario
    )

    order = Order.create!(
      status: 'pending',
      total_price: 0.0,
      customer_name: 'Maria',
      customer_email: 'maria@example.com',
      customer_cpf: '529.982.247-25',
      establishment: establishment
    )

    menu = Menu.create!(
      name: 'Cardápio Principal',
      description: 'Cardápio com todos os pratos disponíveis',
      establishment: establishment
    )

    dish = Dish.create!(
      name: 'Pizza Margherita',
      description: 'Pizza tradicional italiana',
      establishment: establishment
    )

    menu_item = MenuItem.create!(
      menu: menu,
      dish: dish
    )

    portion = Portion.create!(
      description: 'Pizza Grande',
      price: 50.0,
      dish: dish
    )

    OrderMenuItem.create!(
      order: order,
      menu_item: menu_item,
      portion: portion,
      quantity: 3
    )

    order.reload

    sign_in proprietario
    
    visit establishment_order_path(establishment, order)

    expect(page).to have_content "Pedido ##{order.id}"
    status = 'Pendente'
    expect(page).to have_content "Status: #{status}"
    expect(page).to have_content 'Nome: Maria'
    expect(page).to have_content 'Email: maria@example.com'
    expect(page).to have_content 'cpf: 529.982.247-25'
    expect(page).to have_content "Valor Total: R$ #{format('%.2f', order.total_price).gsub('.', ',')}"
  end

  it 'usuário vê pedido com status em preparação' do
    proprietario = User.create!(
      name: 'João',
      last_name: 'Silva',
      cpf: '747.356.180-50',
      email: 'joao@example.com',
      password: 'password123456',
      role: true
    )

    establishment = Establishment.create!(
      name: 'Restaurante do João',
      social_name: 'Restaurante do João LTDA',
      cnpj: '78.288.042/0001-67',
      code: 'REST123',
      full_address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '01234-567',
      email: 'contato@restaurantedojoao.com',
      phone_number: '11999999999',
      user: proprietario
    )

    order = Order.create!(
      status: 'preparing',
      total_price: 0.0,
      customer_name: 'Carlos',
      customer_email: 'carlos@example.com',
      customer_cpf: '529.982.247-25',
      establishment: establishment
    )

    menu = Menu.create!(
      name: 'Cardápio Principal',
      description: 'Cardápio com todos os pratos disponíveis',
      establishment: establishment
    )

    dish = Dish.create!(
      name: 'Pizza Margherita',
      description: 'Pizza tradicional italiana',
      establishment: establishment
    )

    menu_item = MenuItem.create!(
      menu: menu,
      dish: dish
    )

    portion = Portion.create!(
      description: 'Pizza Grande',
      price: 50.0,
      dish: dish
    )

    order_menu_item = OrderMenuItem.create!(
      order: order,
      menu_item: menu_item,
      portion: portion,
      quantity: 3
    )

    order.reload

    sign_in proprietario
    
    visit establishment_order_path(establishment, order)

    expect(page).to have_content "Pedido ##{order.id}"
    status = 'Em Preparação'
    expect(page).to have_content "Status: #{status}"
    expect(page).to have_content 'Nome: Carlos'
    expect(page).to have_content 'Email: carlos@example.com'
    expect(page).to have_content 'cpf: 529.982.247-25'
    expect(page).to have_content "R$ #{format('%.2f', portion.price * order_menu_item.quantity).gsub('.', ',')}"
  end
end
