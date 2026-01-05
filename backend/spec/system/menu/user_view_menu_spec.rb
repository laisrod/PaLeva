require 'rails_helper'

describe 'Visualização de Menu' do
  it 'usuário vê detalhes de um menu' do
    owner = User.create!(
      name: 'João',
      last_name: 'Silva',
      cpf: '048.556.180-50',
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
      user: owner
    )

    menu = Menu.create!(
      name: 'Cardápio Principal',
      description: 'Cardápio com pratos principais',
      establishment: establishment
    )
    dish = Dish.create!(
      name: 'X-Burger',
      description: 'teste',
      establishment: establishment
    )
    menu_item_dish = MenuItem.create!(menu: menu, dish: dish)

    login_as(owner)
    visit establishment_menu_path(establishment, menu)

    expect(page).to have_content 'Cardápio Principal'
    expect(page).to have_content 'Cardápio com pratos principais'
    expect(page).to have_content 'Informações do Cardápio'
    expect(page).to have_content 'X-Burger'
    expect(page).to have_content 'teste'
    expect(page).to have_button 'Remover'
    expect(page).to have_link 'Editar'
  end
end
