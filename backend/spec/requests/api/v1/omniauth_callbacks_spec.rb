require 'rails_helper'

RSpec.describe 'API::V1::OmniauthCallbacks', type: :request do
  describe 'GET /api/v1/login/google' do
    let(:client_id) { 'test-client-id-123' }

    before do
      allow(ENV).to receive(:[]).and_call_original
      allow(ENV).to receive(:[]).with('GOOGLE_CLIENT_ID').and_return(client_id)
    end

    it 'redireciona para o Google OAuth com os parâmetros corretos' do
      get '/api/v1/login/google'

      expect(response).to have_http_status(:redirect)
      expect(response.location).to start_with('https://accounts.google.com/o/oauth2/auth')
      expect(response.location).to include("client_id=#{CGI.escape(client_id)}")
      expect(response.location).to include('response_type=code')
      expect(response.location).to include('scope=email+profile')
      expect(response.location).to include('access_type=offline')
      expect(response.location).to include('prompt=select_account')
      # Verifica que o redirect_uri contém o caminho correto (sem depender do base_url exato)
      expect(response.location).to include(CGI.escape('/api/v1/login/google_oauth2/callback'))
    end

    it 'usa o client_id das variáveis de ambiente' do
      custom_client_id = 'custom-client-id-456'
      allow(ENV).to receive(:[]).with('GOOGLE_CLIENT_ID').and_return(custom_client_id)

      get '/api/v1/login/google'

      expect(response.location).to include("client_id=#{CGI.escape(custom_client_id)}")
    end

    context 'quando GOOGLE_CLIENT_ID não está configurado' do
      before do
        allow(ENV).to receive(:[]).with('GOOGLE_CLIENT_ID').and_return(nil)
      end

      it 'ainda redireciona, mas com client_id vazio' do
        get '/api/v1/login/google'

        expect(response).to have_http_status(:redirect)
        expect(response.location).to start_with('https://accounts.google.com/o/oauth2/auth')
        # Quando client_id é nil, ele vira string vazia após o || ''
        expect(response.location).to include('client_id=')
      end
    end
  end

  describe 'GET /api/v1/login/google_oauth2/callback' do
    let(:code) { 'valid-auth-code-123' }
    let(:access_token) { 'valid-access-token-456' }
    let(:frontend_url) { 'http://localhost:5177' }
    let(:user_info) do
      {
        'sub' => 'google-user-id-123',
        'email' => 'user@example.com',
        'given_name' => 'João',
        'family_name' => 'Silva',
        'name' => 'João Silva'
      }
    end
    let(:token_response) do
      {
        'access_token' => access_token,
        'token_type' => 'Bearer',
        'expires_in' => 3600,
        'refresh_token' => 'refresh-token-789'
      }
    end

    before do
      allow(ENV).to receive(:[]).and_call_original
      allow(ENV).to receive(:[]).with('GOOGLE_CLIENT_ID').and_return('test-client-id')
      allow(ENV).to receive(:[]).with('GOOGLE_CLIENT_SECRET').and_return('test-client-secret')
      allow(ENV).to receive(:[]).with('FRONTEND_URL').and_return(frontend_url)
      allow(ENV).to receive(:[]).with('JWT_SECRET').and_return('test-jwt-secret')
    end

    context 'quando o código de autorização é válido' do
      before do
        # Mock da troca de código por token
        token_response_body = token_response.to_json
        token_response_obj = instance_double(Net::HTTPSuccess, body: token_response_body)
        allow(token_response_obj).to receive(:is_a?).with(Net::HTTPSuccess).and_return(true)

        allow(Net::HTTP).to receive(:post_form).and_return(token_response_obj)

        # Mock da busca de informações do usuário
        user_info_body = user_info.to_json
        user_info_response_obj = instance_double(Net::HTTPSuccess, body: user_info_body)
        allow(user_info_response_obj).to receive(:is_a?).with(Net::HTTPSuccess).and_return(true)

        allow(Net::HTTP).to receive(:get_response).and_return(user_info_response_obj)
      end

      context 'quando o usuário não existe' do
        it 'cria um novo usuário e redireciona com token JWT' do
          expect {
            get '/api/v1/login/google_oauth2/callback', params: { code: code }
          }.to change(User, :count).by(1)

          user = User.last
          expect(user.email).to eq(user_info['email'])
          expect(user.name).to eq(user_info['given_name'])
          expect(user.last_name).to eq(user_info['family_name'])
          expect(user.provider).to eq('google_oauth2')
          expect(user.uid).to eq(user_info['sub'])
          expect(user.role).to be true
          # Devise armazena apenas o encrypted_password; o atributo virtual `password`
          # não é persistido. Garantimos que uma senha foi gerada verificando o hash.
          expect(user.encrypted_password).to be_present

          expect(response).to have_http_status(:redirect)
          expect(response.location).to start_with("#{frontend_url}/auth/callback")
          expect(response.location).to include('token=')
          expect(response.location).to include('user=')
        end

        it 'gera um token JWT válido' do
          get '/api/v1/login/google_oauth2/callback', params: { code: code }

          user = User.last
          location = response.location
          token_match = location.match(/token=([^&]+)/)
          
          expect(token_match).not_to be_nil
          token = CGI.unescape(token_match[1])
          
          # Verificar se o token pode ser decodificado
          decoded_token = JWT.decode(token, ENV['JWT_SECRET'], true, { algorithm: 'HS256' }).first
          expect(decoded_token['user_id']).to eq(user.id)
          expect(decoded_token['email']).to eq(user.email)
        end

        it 'inclui dados do usuário na URL de redirecionamento' do
          get '/api/v1/login/google_oauth2/callback', params: { code: code }

          user = User.last
          location = response.location
          user_match = location.match(/user=([^&]+)/)
          
          expect(user_match).not_to be_nil
          user_data = JSON.parse(CGI.unescape(user_match[1]))
          
          expect(user_data['id']).to eq(user.id)
          expect(user_data['email']).to eq(user.email)
          expect(user_data['name']).to eq(user.name)
          expect(user_data['last_name']).to eq(user.last_name)
          expect(user_data['role']).to be true
          expect(user_data['provider']).to eq('google_oauth2')
        end
      end

      context 'quando o usuário já existe pelo provider e uid' do
        let!(:existing_user) do
          # Criar usuário OAuth - usar CPF válido temporário para contornar constraint NOT NULL
          # Em produção real, seria necessário uma migration para permitir NULL no cpf para OAuth
          User.create!(
            email: user_info['email'],
            name: 'Nome Antigo',
            last_name: 'Sobrenome Antigo',
            password: Devise.friendly_token[0, 20],
            provider: 'google_oauth2',
            uid: user_info['sub'],
            role: true,
            cpf: '483.556.180-50' # CPF válido temporário para testes
          )
        end

        it 'atualiza os dados do usuário existente' do
          expect {
            get '/api/v1/login/google_oauth2/callback', params: { code: code }
          }.not_to change(User, :count)

          existing_user.reload
          expect(existing_user.email).to eq(user_info['email'])
          expect(existing_user.name).to eq(user_info['given_name'])
          expect(existing_user.last_name).to eq(user_info['family_name'])
        end

        it 'redireciona com sucesso' do
          get '/api/v1/login/google_oauth2/callback', params: { code: code }

          expect(response).to have_http_status(:redirect)
          expect(response.location).to start_with("#{frontend_url}/auth/callback")
        end
      end

      context 'quando existe usuário com mesmo email mas sem provider' do
        let!(:existing_user) do
          User.create!(
            email: user_info['email'],
            name: 'Nome Antigo',
            last_name: 'Sobrenome Antigo',
            password: 'senha123456789', # Mínimo 12 caracteres
            cpf: '483.556.180-50', # CPF válido necessário quando não é OAuth
            role: true
          )
        end

        it 'vincula o OAuth ao usuário existente' do
          expect {
            get '/api/v1/login/google_oauth2/callback', params: { code: code }
          }.not_to change(User, :count)

          existing_user.reload
          expect(existing_user.provider).to eq('google_oauth2')
          expect(existing_user.uid).to eq(user_info['sub'])
          expect(existing_user.email).to eq(user_info['email'])
        end
      end

      context 'quando o nome não tem given_name e family_name' do
        let(:user_info_without_names) do
          {
            'sub' => 'google-user-id-456',
            'email' => 'user2@example.com',
            'name' => 'João Silva'
          }
        end

        before do
          token_response_body = token_response.to_json
          token_response_obj = instance_double(Net::HTTPSuccess, body: token_response_body)
          allow(token_response_obj).to receive(:is_a?).with(Net::HTTPSuccess).and_return(true)
          allow(Net::HTTP).to receive(:post_form).and_return(token_response_obj)

          user_info_body = user_info_without_names.to_json
          user_info_response_obj = instance_double(Net::HTTPSuccess, body: user_info_body)
          allow(user_info_response_obj).to receive(:is_a?).with(Net::HTTPSuccess).and_return(true)
          allow(Net::HTTP).to receive(:get_response).and_return(user_info_response_obj)
        end

        it 'usa o campo name para extrair nome e sobrenome' do
          get '/api/v1/login/google_oauth2/callback', params: { code: code }

          user = User.find_by(email: user_info_without_names['email'])
          expect(user).not_to be_nil
          expect(user.name).to eq('João')
          expect(user.last_name).to eq('Silva')
        end
      end
    end

    context 'quando o código de autorização não é fornecido' do
      it 'redireciona para o frontend com erro' do
        get '/api/v1/login/google_oauth2/callback'

        expect(response).to have_http_status(:redirect)
        expect(response.location).to start_with("#{frontend_url}/auth/callback")
        expect(response.location).to include('error=')
        expect(response.location).to include(CGI.escape('Código de autorização não fornecido'))
      end
    end

    context 'quando a troca de código por token falha' do
      before do
        error_response = instance_double(Net::HTTPBadRequest, body: '{"error": "invalid_grant"}')
        allow(error_response).to receive(:is_a?).with(Net::HTTPSuccess).and_return(false)
        allow(error_response).to receive(:code).and_return('400')
        allow(Net::HTTP).to receive(:post_form).and_return(error_response)
      end

      it 'redireciona para o frontend com erro' do
        get '/api/v1/login/google_oauth2/callback', params: { code: code }

        expect(response).to have_http_status(:redirect)
        expect(response.location).to start_with("#{frontend_url}/auth/callback")
        expect(response.location).to include('error=')
        expect(response.location).to include(CGI.escape('Falha ao obter token de acesso'))
      end
    end

    context 'quando a busca de informações do usuário falha' do
      before do
        token_response_body = token_response.to_json
        token_response_obj = instance_double(Net::HTTPSuccess, body: token_response_body)
        allow(token_response_obj).to receive(:is_a?).with(Net::HTTPSuccess).and_return(true)
        allow(Net::HTTP).to receive(:post_form).and_return(token_response_obj)

        error_response = instance_double(Net::HTTPUnauthorized, body: '{"error": "invalid_token"}')
        allow(error_response).to receive(:is_a?).with(Net::HTTPSuccess).and_return(false)
        allow(error_response).to receive(:code).and_return('401')
        allow(Net::HTTP).to receive(:get_response).and_return(error_response)
      end

      it 'redireciona para o frontend com erro' do
        get '/api/v1/login/google_oauth2/callback', params: { code: code }

        expect(response).to have_http_status(:redirect)
        expect(response.location).to start_with("#{frontend_url}/auth/callback")
        expect(response.location).to include('error=')
        expect(response.location).to include(CGI.escape('Falha ao obter dados do usuário'))
      end
    end

    context 'quando ocorre uma exceção durante o processamento' do
      before do
        allow_any_instance_of(Api::V1::OmniauthCallbacksController).to receive(:exchange_code_for_token).and_raise(StandardError.new('Erro inesperado'))
      end

      it 'retorna erro 500 com mensagem de erro' do
        get '/api/v1/login/google_oauth2/callback', params: { code: code }

        expect(response).to have_http_status(:internal_server_error)
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to eq('Erro interno do servidor')
        expect(json_response['message']).to eq('Erro inesperado')
      end
    end

    context 'quando o usuário criado é inválido' do
      before do
        token_response_body = token_response.to_json
        token_response_obj = instance_double(Net::HTTPSuccess, body: token_response_body)
        allow(token_response_obj).to receive(:is_a?).with(Net::HTTPSuccess).and_return(true)
        allow(Net::HTTP).to receive(:post_form).and_return(token_response_obj)

        user_info_body = user_info.to_json
        user_info_response_obj = instance_double(Net::HTTPSuccess, body: user_info_body)
        allow(user_info_response_obj).to receive(:is_a?).with(Net::HTTPSuccess).and_return(true)
        allow(Net::HTTP).to receive(:get_response).and_return(user_info_response_obj)

        # Forçar erro de validação
        allow_any_instance_of(User).to receive(:valid?).and_return(false)
        allow_any_instance_of(User).to receive(:errors).and_return(
          instance_double(ActiveModel::Errors, full_messages: ['Email já está em uso'])
        )
      end

      it 'redireciona para o frontend com mensagem de erro' do
        get '/api/v1/login/google_oauth2/callback', params: { code: code }

        expect(response).to have_http_status(:redirect)
        expect(response.location).to start_with("#{frontend_url}/auth/callback")
        expect(response.location).to include('error=')
        expect(response.location).to include(CGI.escape('Email já está em uso'))
      end
    end
  end

  describe 'GET /api/v1/login/failure' do
    it 'retorna erro 401 com mensagem de falha' do
      get '/api/v1/login/failure', params: { message: 'Acesso negado' }

      expect(response).to have_http_status(:unauthorized)
      json_response = JSON.parse(response.body)
      expect(json_response['error']).to eq('Falha na autenticação OAuth')
      expect(json_response['message']).to eq('Acesso negado')
    end

    it 'retorna mensagem padrão quando não há parâmetro message' do
      get '/api/v1/login/failure'

      expect(response).to have_http_status(:unauthorized)
      json_response = JSON.parse(response.body)
      expect(json_response['error']).to eq('Falha na autenticação OAuth')
      expect(json_response['message']).to eq('Erro desconhecido')
    end
  end
end
