require 'rails_helper'
describe 'Gerenciamento de Pratos' do
  it 'cadastra prato com sucesso' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: "user1@example.com",
      password: 'password1230',
      last_name: 'Last Name',
      cpf: '483.556.180-50',
      role: true
    )
    establishment = Establishment.create!(
      name: 'Meu Restaurante',
      social_name: 'Restaurante LTDA',
      cnpj: '39.513.250/0001-60',
      full_address: 'Rua Principal, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '12345-678',
      email: "user1@example.com",
      phone_number: '11999999999',
      user: user
    )
    # Act
    sign_in user
    visit establishment_dishes_path(establishment)
    click_on 'Criar Novo Prato'
    
    fill_in 'Nome', with: 'Feijoada'
    fill_in 'Descrição', with: 'Prato típico brasileiro'
    fill_in 'Calorias', with: '800'
    click_button 'Enviar'


    # Assert
    expect(page).to have_content('O prato foi criado com sucesso')
    expect(page).to have_content('Feijoada')
    expect(page).to have_content('Calorias:')
    expect(Dish.last.calories).to eq(800)
    expect(page).to have_content('800')
  end
  it 'lista apenas pratos do próprio estabelecimento' do
    # Arrange
    user = User.create!(
      name: 'User',
      email: "user1@example.com",
      password: 'password123055555',
      last_name: 'Last Name',
      cpf: '483.556.180-50',
      role: true
    )
    establishment = Establishment.create!(
      name: 'Meu Restaurante',
      social_name: 'Restaurante LTDA',
      cnpj: '39.513.250/0001-60',
      full_address: 'Rua Principal, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '12345-678',
      email: "user1@example.com",
      phone_number: '11999999999',
      user: user
    )
    Dish.create!(
      name: 'Meu Prato',
      description: 'Descrição',
      calories: 500,
      establishment: establishment
    )
    outro_establishment = Establishment.create!(
      name: 'Outro Restaurante',
      social_name: 'Outro LTDA',
      cnpj: '91.124.576/0001-16',
      full_address: 'Outra Rua, 321',
      city: 'Rio de Janeiro',
      state: 'RJ',
      postal_code: '98765-432',
      email: "outro@restaurante.com",
      phone_number: '11988888888',
      user: User.create!(
        name: 'Outro',
        email: 'outro@example.com',
        password: 'password1230',
        last_name: 'Last Name',
        cpf: '483.556.180-50',
        role: true
      )
    )
    # Act
    sign_in user
    visit establishment_dishes_path(establishment)
    # Assert
    expect(page).to have_content('Meu Prato')
    expect(page).not_to have_content('Outro Prato')
  end
end
