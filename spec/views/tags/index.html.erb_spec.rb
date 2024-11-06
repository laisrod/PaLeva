require 'rails_helper'

RSpec.describe "tags/index", type: :view do
  it "exibe a lista de tags" do
    user = User.create!(
      name: 'Usuário',
      last_name: 'Sobrenome',
      cpf: '403.316.830-32',
      email: 'teste@teste.com',
      password: '123456789100'
    )

    @establishment = assign(:establishment, 
      Establishment.create!(
        name: "Restaurante Teste",
        social_name: "Restaurante Teste LTDA",
        cnpj: "25.425.705/0001-81",
        email: "teste@teste.com",
        full_address: "Rua Teste, 123",
        city: "São Paulo",
        state: "SP",
        postal_code: "12345-678",
        phone_number: "(11) 99999-9999",
        user: user
      )
    )
    
    assign(:tags, [
      Tag.create!(name: "Vegano")
    ])

    render
    expect(rendered).to include("Vegano")
  end
end
