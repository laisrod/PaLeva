require 'rails_helper'

RSpec.describe 'API de Cadastro de Usuários' do
  describe 'POST /api/v1/users' do
    def valid_params(overrides = {})
      {
        user: {
          name: 'João',
          last_name: 'Silva',
          email: 'joao@example.com',
          cpf: '529.982.247-25',
          password: 'senha@12345678',
          password_confirmation: 'senha@12345678'
        }.merge(overrides)
      }
    end

    it 'cadastra como client (role false) quando role não é informado' do
      post '/api/v1/users', params: valid_params

      expect(response).to have_http_status(:created)
      expect(User.last.role).to eq(false)
    end

    it 'cadastra como owner quando role=true é informado explicitamente' do
      post '/api/v1/users', params: valid_params(role: true)

      expect(response).to have_http_status(:created)
      expect(User.last.role).to eq(true)
    end
  end
end
