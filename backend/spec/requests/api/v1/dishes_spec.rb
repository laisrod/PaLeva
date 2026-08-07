require 'rails_helper'

RSpec.describe 'API de Pratos' do
  def create_user(email:, cpf:)
    User.create!(
      email: email,
      password: 'senha@12345678',
      name: 'João',
      last_name: 'Silva',
      cpf: cpf
    )
  end

  def create_establishment(code:, user:)
    Establishment.create!(
      name: 'Restaurante Teste',
      social_name: 'Restaurante Teste LTDA',
      code: code,
      cnpj: '96.785.019/0001-60',
      full_address: 'Rua Teste, 123',
      city: 'São Paulo',
      state: 'SP',
      postal_code: '01234-567',
      email: 'contato@restauranteteste.com',
      phone_number: '11999999999',
      user: user
    )
  end

  def token_for(user)
    post '/api/v1/sign_in', params: { user: { email: user.email, password: 'senha@12345678' } }
    JSON.parse(response.body)['token']
  end

  let(:owner) { create_user(email: 'owner@example.com', cpf: '529.982.247-25') }
  let(:establishment) { create_establishment(code: 'DISH01', user: owner) }

  describe 'GET /api/v1/establishments/:establishment_code/dishes' do
    it 'não exige autenticação para listar pratos' do
      Dish.create!(name: 'Feijoada', establishment: establishment)

      get "/api/v1/establishments/#{establishment.code}/dishes"

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST /api/v1/establishments/:establishment_code/dishes' do
    it 'rejeita a criação sem token de autenticação' do
      post "/api/v1/establishments/#{establishment.code}/dishes",
           params: { dish: { name: 'Feijoada' } }

      expect(response).to have_http_status(:unauthorized)
      expect(Dish.count).to eq(0)
    end

    it 'rejeita a criação quando o usuário autenticado não é dono do estabelecimento' do
      other_user = create_user(email: 'other@example.com', cpf: '691.965.443-17')
      token = token_for(other_user)

      post "/api/v1/establishments/#{establishment.code}/dishes",
           params: { dish: { name: 'Feijoada' } },
           headers: { 'Authorization' => "Bearer #{token}" }

      expect(response).to have_http_status(:forbidden)
      expect(Dish.count).to eq(0)
    end
  end
end
