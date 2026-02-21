require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validações básicas' do
    it 'é válido com atributos válidos' do
      user = User.new(
        name: 'Usuário', 
        email: 'usuario@exemplo.com', 
        password: 'senha1234567', 
        last_name: 'Sobrenome', 
        cpf: '483.556.180-50'
      )
      expect(user).to be_valid
    end

    it 'não é válido sem um nome' do
      user = User.new(
        email: 'usuario@exemplo.com', 
        password: 'senha1234567', 
        last_name: 'Sobrenome', 
        cpf: '483.556.180-50'
      )
      expect(user).not_to be_valid
    end

    it 'não é válido sem um email' do
      user = User.new(
        name: 'Usuário', 
        password: 'senha1234567', 
        last_name: 'Sobrenome', 
        cpf: '483.556.180-50'
      )
      expect(user).not_to be_valid
    end

    it 'não é válido sem uma senha' do
      user = User.new(
        name: 'Usuário', 
        email: 'usuario@exemplo.com', 
        last_name: 'Sobrenome', 
        cpf: '483.556.180-50'
      )
      expect(user).not_to be_valid
    end
  end

  describe 'OAuth' do
    describe '.from_google_oauth' do
      let(:user_info) do
        {
          'sub' => 'google-user-id-123',
          'email' => 'oauth@example.com',
          'given_name' => 'João',
          'family_name' => 'Silva',
          'name' => 'João Silva'
        }
      end

      context 'quando o usuário não existe' do
        it 'cria um novo usuário com os dados do Google' do
          expect {
            User.from_google_oauth(user_info)
          }.to change(User, :count).by(1)

          user = User.last
          expect(user.email).to eq(user_info['email'])
          expect(user.name).to eq(user_info['given_name'])
          expect(user.last_name).to eq(user_info['family_name'])
          expect(user.provider).to eq('google_oauth2')
          expect(user.uid).to eq(user_info['sub'])
          expect(user.role).to be true
          expect(user.password).not_to be_nil
        end

        it 'gera uma senha aleatória' do
          user = User.from_google_oauth(user_info)
          expect(user.password).not_to be_nil
          expect(user.password.length).to be > 0
        end

        it 'define role como true por padrão' do
          user = User.from_google_oauth(user_info)
          expect(user.role).to be true
        end
      end

      context 'quando o usuário já existe' do
        let!(:existing_user) do
          User.create!(
            email: user_info['email'],
            name: 'Nome Antigo',
            last_name: 'Sobrenome Antigo',
            password: 'senha123456',
            provider: 'google_oauth2',
            uid: user_info['sub'],
            role: true
          )
        end

        it 'retorna o usuário existente sem criar novo' do
          expect {
            User.from_google_oauth(user_info)
          }.not_to change(User, :count)

          user = User.from_google_oauth(user_info)
          expect(user.id).to eq(existing_user.id)
        end
      end

      context 'quando não há given_name e family_name' do
        let(:user_info_without_names) do
          {
            'sub' => 'google-user-id-123',
            'email' => 'oauth@example.com',
            'name' => 'João Silva'
          }
        end

        it 'extrai nome e sobrenome do campo name' do
          user = User.from_google_oauth(user_info_without_names)
          expect(user.name).to eq('João')
          expect(user.last_name).to eq('Silva')
        end
      end

      context 'quando não há name, given_name ou family_name' do
        let(:user_info_minimal) do
          {
            'sub' => 'google-user-id-123',
            'email' => 'oauth@example.com'
          }
        end

        it 'usa valores padrão' do
          user = User.from_google_oauth(user_info_minimal)
          expect(user.name).to eq('Usuário')
          expect(user.last_name).to eq('')
        end
      end
    end

    describe '#update_google_oauth_data' do
      let(:user) do
        User.create!(
          email: 'old@example.com',
          name: 'Nome Antigo',
          last_name: 'Sobrenome Antigo',
          password: 'senha123456',
          role: true
        )
      end

      let(:user_info) do
        {
          'email' => 'new@example.com',
          'given_name' => 'Novo Nome',
          'family_name' => 'Novo Sobrenome',
          'name' => 'Novo Nome Novo Sobrenome'
        }
      end

      it 'atualiza email, nome e sobrenome' do
        user.update_google_oauth_data(user_info)
        user.reload

        expect(user.email).to eq(user_info['email'])
        expect(user.name).to eq(user_info['given_name'])
        expect(user.last_name).to eq(user_info['family_name'])
      end

      it 'mantém o nome original se given_name não estiver presente' do
        user_info_without_given = user_info.merge('given_name' => nil)
        original_name = user.name

        user.update_google_oauth_data(user_info_without_given)
        user.reload

        expect(user.name).to eq(original_name)
      end

      it 'mantém o sobrenome original se family_name não estiver presente' do
        user_info_without_family = user_info.merge('family_name' => nil)
        original_last_name = user.last_name

        user.update_google_oauth_data(user_info_without_family)
        user.reload

        expect(user.last_name).to eq(original_last_name)
      end

      it 'extrai nome do campo name se given_name não estiver presente' do
        user_info_with_name_only = {
          'email' => 'new@example.com',
          'name' => 'Nome Completo'
        }

        user.update_google_oauth_data(user_info_with_name_only)
        user.reload

        expect(user.name).to eq('Nome')
      end
    end

    describe 'validação de CPF para OAuth' do
      it 'permite CPF vazio quando provider está presente' do
        user = User.new(
          name: 'Usuário',
          email: 'oauth@example.com',
          password: 'senha123456',
          last_name: 'Sobrenome',
          provider: 'google_oauth2',
          uid: 'google-id-123',
          cpf: nil
        )
        expect(user).to be_valid
      end

      it 'valida CPF quando provider não está presente' do
        user = User.new(
          name: 'Usuário',
          email: 'user@example.com',
          password: 'senha123456',
          last_name: 'Sobrenome',
          cpf: '123.456.789-00' # CPF inválido
        )
        expect(user).not_to be_valid
        expect(user.errors[:cpf]).to include('inválido')
      end
    end
  end
end