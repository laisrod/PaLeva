require 'rails_helper'

RSpec.describe Drink, type: :model do
  it 'é válido com atributos válidos' do
    user = User.create!(
      name: 'Usuário', 
      email: 'usuario@exemplo.com', 
      password: 'senha1234567', 
      last_name: 'Sobrenome', 
      cpf: '483.556.180-50'
    )
    
    establishment = Establishment.create!(
      name: 'Estabelecimento', 
      social_name: 'Estabelecimento', 
      cnpj: '43.970.890/0001-77', 
      full_address: 'Rua Principal, 123', 
      city: 'Cidade Exemplo', 
      state: 'SP', 
      postal_code: '12345-678', 
      email: 'estabelecimento@exemplo.com', 
      phone_number: '(11) 98765-4321', 
      user_id: user.id
    )
    
    drink = Drink.new(
      name: 'Suco', 
      description: 'Descrição do suco',
      calories: 10.0, 
      establishment_id: establishment.id, 
      alcoholic: false
    )
    
    expect(drink).to be_valid
  end
end