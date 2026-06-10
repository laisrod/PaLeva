require 'rails_helper'

RSpec.describe Rating, type: :model do
  let(:user) do
    User.create!(name: 'User', last_name: 'Test', email: 'user@example.com',
                 password: 'password123456', cpf: '483.556.180-50')
  end

  let(:establishment) do
    Establishment.create!(name: 'Restaurante', social_name: 'Rest LTDA',
                          cnpj: '39.513.250/0001-60', full_address: 'Rua A, 1',
                          city: 'SP', state: 'SP', postal_code: '01234-567',
                          email: 'rest@example.com', phone_number: '11999999999',
                          user: user)
  end

  let(:dish) { Dish.create!(name: 'Pizza', description: 'Massa fina', establishment: establishment) }
  let(:drink) { Drink.create!(name: 'Suco', description: 'Natural', establishment: establishment) }

  describe 'validações' do
    it 'é válida com prato e nota' do
      rating = Rating.new(user: user, dish: dish, rating: 4)
      expect(rating).to be_valid
    end

    it 'é válida com bebida e nota' do
      rating = Rating.new(user: user, drink: drink, rating: 3)
      expect(rating).to be_valid
    end

    it 'é inválida sem nota' do
      rating = Rating.new(user: user, dish: dish)
      expect(rating).not_to be_valid
      expect(rating.errors[:rating]).to be_present
    end

    it 'é inválida com nota fora do intervalo 1-5' do
      rating = Rating.new(user: user, dish: dish, rating: 6)
      expect(rating).not_to be_valid
    end

    it 'é inválida sem prato nem bebida' do
      rating = Rating.new(user: user, rating: 4)
      expect(rating).not_to be_valid
      expect(rating.errors[:base]).to include('Deve ter um prato ou uma bebida')
    end

    it 'é inválida com prato e bebida ao mesmo tempo' do
      rating = Rating.new(user: user, dish: dish, drink: drink, rating: 4)
      expect(rating).not_to be_valid
      expect(rating.errors[:base]).to include('Não pode ter prato e bebida ao mesmo tempo')
    end
  end

  describe '.average_rating_for_dish' do
    it 'retorna a média das notas de um prato' do
      user2 = User.create!(name: 'User2', last_name: 'Test', email: 'user2@example.com',
                           password: 'password123456', cpf: '529.982.247-25')
      Rating.create!(user: user, dish: dish, rating: 4)
      Rating.create!(user: user2, dish: dish, rating: 2)
      expect(Rating.average_rating_for_dish(dish.id)).to eq(3.0)
    end

    it 'retorna 0 quando não há avaliações' do
      expect(Rating.average_rating_for_dish(dish.id)).to eq(0)
    end
  end

  describe '.average_rating_for_drink' do
    it 'retorna a média das notas de uma bebida' do
      user2 = User.create!(name: 'User2', last_name: 'Test', email: 'user2@example.com',
                           password: 'password123456', cpf: '529.982.247-25')
      Rating.create!(user: user, drink: drink, rating: 5)
      Rating.create!(user: user2, drink: drink, rating: 3)
      expect(Rating.average_rating_for_drink(drink.id)).to eq(4.0)
    end

    it 'retorna 0 quando não há avaliações' do
      expect(Rating.average_rating_for_drink(drink.id)).to eq(0)
    end
  end
end
