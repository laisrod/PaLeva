require 'rails_helper'

RSpec.describe Review, type: :model do
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

  let(:order) do
    Order.create!(establishment: establishment, status: :pending,
                  customer_name: 'Cliente', customer_email: 'cliente@example.com',
                  customer_cpf: '529.982.247-25')
  end

  describe 'validações' do
    it 'é válida com nota e pedido' do
      review = Review.new(user: user, order: order, rating: 5)
      expect(review).to be_valid
    end

    it 'é inválida sem nota' do
      review = Review.new(user: user, order: order)
      expect(review).not_to be_valid
      expect(review.errors[:rating]).to be_present
    end

    it 'é inválida com nota fora do intervalo 1-5' do
      review = Review.new(user: user, order: order, rating: 0)
      expect(review).not_to be_valid
    end

    it 'não permite o mesmo usuário avaliar o mesmo pedido duas vezes' do
      Review.create!(user: user, order: order, rating: 4)
      review = Review.new(user: user, order: order, rating: 5)
      expect(review).not_to be_valid
      expect(review.errors[:user_id]).to include('já avaliou este pedido')
    end
  end

  describe '.average_rating_for_order' do
    it 'retorna a média das notas de um pedido' do
      user2 = User.create!(name: 'User2', last_name: 'Test', email: 'user2@example.com',
                           password: 'password123456', cpf: '529.982.247-25')
      Review.create!(user: user, order: order, rating: 4)
      Review.create!(user: user2, order: order, rating: 2)
      expect(Review.average_rating_for_order(order.id)).to eq(3.0)
    end

    it 'retorna 0 quando não há avaliações' do
      expect(Review.average_rating_for_order(order.id)).to eq(0)
    end
  end
end
