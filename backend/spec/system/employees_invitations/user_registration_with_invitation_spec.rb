require 'rails_helper'

RSpec.describe 'Registro de usuário com convite', type: :system do
  it 'vincula usuário ao estabelecimento automaticamente' do
    # Arrange
    user = User.create!(
      name: 'Owner', email: 'owner@example.com', password: 'testes123456',
      last_name: 'Last', cpf: '529.982.247-25', role: true
    )
    establishment = Establishment.create!(
      name: 'Restaurante', social_name: 'Restaurante LTDA',
      cnpj: '39.513.250/0001-60', full_address: 'Rua Principal, 123',
      city: 'São Paulo', state: 'SP', postal_code: '12345-678',
      email: 'contato@restaurante.com', phone_number: '11999999999',
      user: user
    )

    # Act
    login_as user
    visit new_establishment_employee_invitation_path(establishment)
    fill_in 'Email do Funcionário', with: 'employee@example.com'
    fill_in 'CPF do Funcionário', with: '048.527.367-92'
    click_on 'Enviar Convite'

    # Assert
    expect(page).to have_content 'Convite criado com sucesso!'
    expect(User.last.establishment).to eq establishment
    expect(User.last.role).to be true
  end
end 