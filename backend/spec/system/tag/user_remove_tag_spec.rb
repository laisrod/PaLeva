require 'rails_helper'

RSpec.describe 'User remove tag', type: :system do
  it 'successfully' do
    user = User.create!(name: 'User', email: 'user@example.com', password: 'password123454', cpf: '343.837.760-86', last_name: 'Last Name')
    establishment = Establishment.create!(name: 'Restaurante', social_name: 'Restaurante LTDA', email: 'restaurante@example.com', cnpj: '85.655.054/0001-48', full_address: 'Rua Principal, 123', city: 'São Paulo', state: 'SP', postal_code: '12345-678', phone_number: '11999999999', user: user)
    dish = Dish.create!(name: 'Feijoada', description: 'Prato típico brasileiro', establishment: establishment)
    tag = Tag.create!(name: 'Vegano')

    login_as user
    visit root_path
    click_on 'Ver Pratos'
    click_on 'Feijoada'
    click_on 'Editar este prato'
  end
end