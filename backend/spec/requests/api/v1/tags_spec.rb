require 'rails_helper'

RSpec.describe 'API de Tags' do
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
  let(:establishment) { create_establishment(code: 'TAG001', user: owner) }

  describe 'POST /api/v1/establishments/:establishment_code/tags' do
    it 'rejeita a criação sem token de autenticação' do
      post "/api/v1/establishments/#{establishment.code}/tags",
           params: { tag: { name: 'Vegano', category: 'dish' } }

      expect(response).to have_http_status(:unauthorized)
      expect(Tag.count).to eq(0)
    end

    it 'rejeita a criação quando o usuário autenticado não é dono do estabelecimento' do
      other_user = create_user(email: 'other@example.com', cpf: '863.205.685-93')
      token = token_for(other_user)

      post "/api/v1/establishments/#{establishment.code}/tags",
           params: { tag: { name: 'Vegano', category: 'dish' } },
           headers: { 'Authorization' => "Bearer #{token}" }

      expect(response).to have_http_status(:forbidden)
      expect(Tag.count).to eq(0)
    end

    it 'permite a criação quando o usuário autenticado é dono do estabelecimento' do
      token = token_for(owner)

      post "/api/v1/establishments/#{establishment.code}/tags",
           params: { tag: { name: 'Vegano', category: 'dish' } },
           headers: { 'Authorization' => "Bearer #{token}" }

      expect(response).to have_http_status(:created)
      expect(Tag.count).to eq(1)
    end
  end
end
