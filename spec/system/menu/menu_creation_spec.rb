require 'rails_helper'

RSpec.describe 'Criação de Cardápio', type: :system do
  it 'usuário cria um novo cardápio com sucesso' do
    user = User.create!(
      name: 'User', 
      email: 'user99913@example.com', 
      last_name: 'Last Name', 
      cpf: '483.556.180-50', 
      password: 'testes123456'
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

    visit new_user_session_path
    fill_in 'user[email]', with: user.email
    fill_in 'user[password]', with: 'testes123456'
    click_button 'Log in'

    visit new_establishment_menu_path(establishment)
    puts page.html
    expect(page).to have_content('Novo Cardápio')
    within('.card-body.menu-form') do
      fill_in 'menu_name', with: 'Café da Manhã'
      fill_in 'Descrição', with: 'Cardápio especial para começar bem o dia'
      
      check "menu_dish_ids_#{pao_queijo.id}"
      check "menu_drink_ids_#{cafe.id}"
    end

    click_on 'Criar Cardápio'

    expect(page).to have_content('Cardápio criado com sucesso')
    expect(page).to have_content('Café da Manhã')
    expect(page).to have_content('Cardápio especial para começar bem o dia')
    expect(page).to have_content('Pão de Queijo')
    expect(page).to have_content('Café')
  end
end 