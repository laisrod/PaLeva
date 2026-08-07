require 'rails_helper'

RSpec.describe 'API de Estabelecimentos' do
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
  let(:establishment) { create_establishment(code: 'EST0001', user: owner) }

  describe 'PATCH /api/v1/establishments/:code' do
    it 'rejeita a atualização sem token de autenticação' do
      patch "/api/v1/establishments/#{establishment.code}",
            params: { establishment: { name: 'Nome invasor' } }

      expect(response).to have_http_status(:unauthorized)
      expect(establishment.reload.name).to eq('Restaurante Teste')
    end

    it 'rejeita a atualização quando o usuário autenticado não é dono do estabelecimento' do
      other_user = create_user(email: 'other@example.com', cpf: '679.007.406-60')
      token = token_for(other_user)

      patch "/api/v1/establishments/#{establishment.code}",
            params: { establishment: { name: 'Nome invasor' } },
            headers: { 'Authorization' => "Bearer #{token}" }

      expect(response).to have_http_status(:forbidden)
      expect(establishment.reload.name).to eq('Restaurante Teste')
    end

    it 'permite a atualização quando o usuário autenticado é dono do estabelecimento' do
      token = token_for(owner)

      patch "/api/v1/establishments/#{establishment.code}",
            params: { establishment: { name: 'Nome atualizado' } },
            headers: { 'Authorization' => "Bearer #{token}" }

      expect(response).to have_http_status(:ok)
      expect(establishment.reload.name).to eq('Nome atualizado')
    end
  end
end
