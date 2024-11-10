require 'rails_helper'

RSpec.describe 'Filtragem de pratos por características', type: :system do
  it 'filtra pratos por características selecionadas' do
    # Arrange
    user = User.create!(email: 'teste@teste.com', password: '123456789012', name: 'João', last_name: 'Silva', cpf: '586.467.500-86', role: true)
    establishment = Establishment.create!(name: 'Restaurante do João', cnpj: '91.883.071/0001-35', social_name: 'Restaurante do João LTDA', full_address: 'Rua do João, 123', city: 'São Paulo', state: 'SP', postal_code: '12345678', email: 'joao@restaurante.com', phone_number: '11999999999', user: user)
    tag = Tag.create!(name: 'Vegano')
    dish = Dish.create!(name: 'Pizza', establishment: establishment, tags: [tag])

    # Act
    login_as(user)
    visit establishment_dishes_path(establishment)

    expect(page).to have_field("tag_ids_", type: 'checkbox')
    check "tag_ids_"
    click_on 'Filtrar'
    # Assert
    expect(page).to have_content(dish.name)
  end

  it 'tenta filtra pratos por características selecionadas mas nao encontra' do
    # Arrange
    user = User.create!(email: 'teste@teste.com', password: '123456789012', name: 'João', last_name: 'Silva', cpf: '586.467.500-86', role: true)
    establishment = Establishment.create!(name: 'Restaurante do João', cnpj: '91.883.071/0001-35', social_name: 'Restaurante do João LTDA', full_address: 'Rua do João, 123', city: 'São Paulo', state: 'SP', postal_code: '12345678', email: 'joao@restaurante.com', phone_number: '11999999999', user: user)
    dish = Dish.create!(name: 'Pizza', establishment: establishment)

    # Act
    login_as(user)
    visit establishment_dishes_path(establishment)
    expect(page).not_to have_field("tag_ids_", type: 'checkbox')
    # Assert
    expect(page).to have_content(dish.name)
  end

  it 'tenta filtrar pratos sem selecionar características' do
    # Arrange
    user = User.create!(email: 'teste@teste.com', password: '123456789012', name: 'João', last_name: 'Silva', cpf: '586.467.500-86', role: true)
    establishment = Establishment.create!(name: 'Restaurante do João', cnpj: '91.883.071/0001-35', social_name: 'Restaurante do João LTDA', full_address: 'Rua do João, 123', city: 'São Paulo', state: 'SP', postal_code: '12345678', email: 'joao@restaurante.com', phone_number: '11999999999', user: user)

    # Act
    login_as(user)
    visit establishment_dishes_path(establishment)
    click_on 'Filtrar'
    # Assert
    expect(page).to have_content('Nenhum prato cadastrado')
  end
end
