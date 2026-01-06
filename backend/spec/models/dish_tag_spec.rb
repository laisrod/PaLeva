require 'rails_helper'

RSpec.describe DishTag, type: :model do


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
    
    dish = Dish.create!(
      name: 'Prato', 
      calories: 10.0, 
      establishment_id: establishment.id
    )

    tag = Tag.create!(name: 'Vegano')
    
    dish_tag = DishTag.new(
      dish: dish,
      tag: tag
    )
    
    expect(dish_tag).to be_valid
  end

  describe 'validações' do
    it 'não é válido sem um prato' do
      tag = Tag.create!(name: 'Vegano')
      dish_tag = DishTag.new(tag: tag)
      
      expect(dish_tag).not_to be_valid
    end

    it 'não é válido sem uma tag' do
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

      dish_tag = DishTag.new(dish: dish)
      
      expect(dish_tag).not_to be_valid
    end

    it 'permite duplicatas da mesma combinação prato-tag' do
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

      tag = Tag.create!(name: 'Vegano')
      
      DishTag.create!(dish: dish, tag: tag)
      duplicate_dish_tag = DishTag.new(dish: dish, tag: tag)
      
      expect(duplicate_dish_tag).to be_valid
      expect(duplicate_dish_tag.errors).to be_empty
    end
  end
end
