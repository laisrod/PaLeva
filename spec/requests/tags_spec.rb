require 'rails_helper'

RSpec.describe "Tags", type: :request do
  describe "Gerenciamento de características" do
    context "usuário autenticado" do
      it "acessa a página de características com sucesso" do
        # Arrange
        user = User.create!(
          email: 'email@email.com',
          password: '123456789012',
          name: 'João',
          last_name: 'Silva',
          cpf: '586.467.500-86'
        )
        establishment = Establishment.create!(
          name: 'Restaurante do João',
          cnpj: '91.883.071/0001-35',
          social_name: 'Restaurante do João LTDA',
          full_address: 'Rua do João, 123',
          city: 'São Paulo',
          state: 'SP',
          postal_code: '12345678',
          email: 'joao@restaurante.com',
          phone_number: '11999999999',
          user: user
        )
        sign_in user

        # Act
        get tags_path, params: { establishment_id: establishment.id }

        # Assert
        expect(response).to have_http_status(:success)
        expect(response.body).to include 'Características'
        expect(response.body).to include 'Criar Característica'
        expect(response.body).to include 'Voltar para Pratos'
      end
    end
  end
end
