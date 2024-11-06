require 'rails_helper'

RSpec.describe 'Usuário gerencia características dos pratos' do
  it 'adiciona características a um prato' do
    # Arrange
    user = User.create!(
      email: 'email@email.com',
      password: '123456789012',
      name: 'João',
      last_name: 'Silva',
      cpf: '483.556.180-50'
    )
    establishment = Establishment.create!(
      name: 'Restaurante do João',
      cnpj: '91.883.071/0001-35',
      social_name: 'Restaurante do João LTDA',
      full_address: 'Rua do João, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '12345678',
      email: 'joao@restaurante.com',
      phone_number: '11999999999',
      user: user
    )
    dish = Dish.create!(
      name: 'Feijoada',
      description: 'Prato tradicional',
      establishment: establishment
    )
    Portion.create!(
      description: 'Porção individual',
      price: 30.00,
      dish_id: dish.id
    )
    Tag.create!(name: 'Vegano')
    Tag.create!(name: 'Sem Glúten')

    # Act
    login_as user
    visit root_path
    click_on 'Ver Pratos'
    click_on 'Feijoada'
    click_on 'Editar este prato'
    
    
    check 'Vegano'
    click_on 'Salvar'

    # Assert
    expect(page).to have_content 'O prato foi atualizado com sucesso.'
    expect(page).to have_content 'Características:'
    expect(page).to have_content 'Vegano'
  end
end 