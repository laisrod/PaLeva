require 'rails_helper'

RSpec.describe "API de Pedidos" do
  describe "GET /api/v1/establishments/:code/orders" do
    def create_establishment(code:)
      user = User.create!(
        email: 'test@example.com',
        password: 'senha@12345678',
        name: 'João',
        last_name: 'Silva',
        cpf: '529.982.247-25'
      )
      
      establishment = Establishment.create!(
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
      
      [establishment, user]
    end
    
    it "retorna todos os pedidos do estabelecimento" do
      establishment, user = create_establishment(code: 'ABC123')
      
      # Criar pedidos de teste
      Order.create!(establishment: establishment)
      Order.create!(establishment: establishment)
      
      # Fazer login
      post '/users/sign_in', params: {
        user: {
          email: user.email,
          password: 'senha@12345678'
        }
      }
      
      # Debug da URL
      puts "\nChamando URL: /api/v1/establishments/#{establishment.code}/orders"
      get "/api/v1/establishments/#{establishment.code}/orders"
      
      # Debug da resposta
      puts "Status: #{response.status}"
      puts "Body: #{response.body}"
      
      expect(response).to have_http_status(:ok)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body).to be_an(Array)
      expect(parsed_body.length).to eq(2)
    end
  end
end