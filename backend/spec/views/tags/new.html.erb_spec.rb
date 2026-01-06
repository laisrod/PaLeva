require 'rails_helper'

RSpec.describe "tags/new", type: :view do
  it "exibe o formulário de nova tag" do
    assign(:tag, Tag.new)
    
    user = User.create!(name: 'Usuário', email: 'teste@teste.com', password: 'teste123456789', cpf: '403.316.830-32', last_name: 'Sobrenome')
    @establishment = assign(:establishment, 
      Establishment.create!(
        name: "Restaurante Teste",
        social_name: "Restaurante Teste LTDA",
        cnpj: "61.318.951/0001-06",
        email: "teste@teste.com",
        full_address: "Rua Teste, 123",
        city: "São Paulo",
        state: "SP",
        postal_code: "12345-678",
        phone_number: "(11) 99999-9999",
        user: user
      )
    )

    render

    expect(rendered).to include('Criar Característica')
    expect(rendered).to have_selector('form')
  end
end
