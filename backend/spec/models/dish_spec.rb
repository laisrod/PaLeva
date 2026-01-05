require 'rails_helper'

RSpec.describe Dish, type: :model do
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
      cnpj: '64.976.883/0001-52', 
      full_address: 'Rua Principal, 123', 
      city: 'Cidade Exemplo', 
      state: 'SP', 
      postal_code: '12345-678', 
      email: 'estabelecimento@exemplo.com', 
      phone_number: '(11) 98765-4321', 
      user_id: user.id
    )
    
    dish = Dish.new(
      name: 'Prato', 
      calories: 10.0, 
      establishment_id: establishment.id
    )
    
    expect(dish).to be_valid
  end  

  describe 'status' do
    it 'começa ativo por padrão' do
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
        cnpj: '64.976.883/0001-52', 
        full_address: 'Rua Principal, 123', 
        city: 'Cidade Exemplo', 
        state: 'SP', 
        postal_code: '12345-678', 
        email: 'estabelecimento@exemplo.com', 
        phone_number: '(11) 98765-4321', 
        user_id: user.id
      )
      
      dish = Dish.new(
        name: 'Prato', 
        calories: 10.0, 
        establishment_id: establishment.id
      )
      
      expect(dish.status).to eq true
    end

    it 'pode ser desativado' do
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
        cnpj: '64.976.883/0001-52', 
        full_address: 'Rua Principal, 123', 
        city: 'Cidade Exemplo', 
        state: 'SP', 
        postal_code: '12345-678', 
        email: 'estabelecimento@exemplo.com', 
        phone_number: '(11) 98765-4321', 
        user_id: user.id
      )
      
      dish = Dish.create!(
        name: 'Prato', 
        calories: 10.0, 
        establishment_id: establishment.id
      )
      
      dish.update(status: false)
      expect(dish.status).to be false
    end

    it 'pode ser reativado' do
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
        cnpj: '64.976.883/0001-52', 
        full_address: 'Rua Principal, 123', 
        city: 'Cidade Exemplo', 
        state: 'SP', 
        postal_code: '12345-678', 
        email: 'estabelecimento@exemplo.com', 
        phone_number: '(11) 98765-4321', 
        user_id: user.id
      )
      
      dish = Dish.create!(
        name: 'Prato', 
        calories: 10.0, 
        establishment_id: establishment.id
      )
      
      dish.update(status: false)
      dish.update(status: true)
      expect(dish.status).to be true
    end
  end
end