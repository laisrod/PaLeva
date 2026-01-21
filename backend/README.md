# PaLeva Backend

Backend API desenvolvido em Ruby on Rails para o sistema PaLeva - gestão de estabelecimentos de comida.

## Autenticação

A aplicação utiliza **Firebase Auth** para autenticação de usuários. O sistema suporta dois métodos de autenticação:

### 1. Autenticação via Header (API Requests)
Para requisições da API, o token Firebase deve ser enviado no header `Authorization`:
```
Authorization: Bearer <firebase_token>
```

### 2. Autenticação via Cookie (HTML Requests)
Para requisições HTML diretas no navegador, o token é armazenado em um cookie `firebase_token`. O cookie é definido automaticamente após o login através do endpoint `/api/v1/set_cookie`.

### Fluxo de Autenticação

1. **Frontend**: Usuário faz login no Firebase Auth
2. **Frontend**: Obtém token JWT do Firebase
3. **Frontend**: Envia token para backend via header ou define cookie
4. **Backend**: Valida token usando `FirebaseTokenValidator`
5. **Backend**: Busca usuário no banco pelo email do Firebase
6. **Backend**: Retorna dados do usuário (role, establishment, etc.)

### Endpoints de Autenticação

- `POST /api/v1/users` - Criar usuário (requer token Firebase)
- `GET /api/v1/is_signed_in` - Verificar se está autenticado
- `POST /api/v1/set_cookie` - Definir cookie com token Firebase (para requisições HTML)
- `DELETE /api/v1/sign_out` - Fazer logout e limpar cookie

### Módulos de Autenticação

- **`Authenticable`**: Autenticação via Firebase (lê token de header ou cookie)
- **`Authorizable`**: Verificação de permissões (owner/employee)
- **`EstablishmentRequired`**: Validação de estabelecimento obrigatório para usuários

## Configuração

### Variáveis de Ambiente

Configure o Firebase Project ID:
```env
FIREBASE_PROJECT_ID=seu-project-id
```

### Dependências

- Ruby 3.3.4+
- Rails 7.2.2
- Firebase Auth (via JWT)
- SQLite3

## Como executar

```bash
bundle install
rails db:create db:migrate
rails server
```

## Estrutura

- `app/controllers/api/v1/` - Controllers da API REST
- `app/controllers/web/establishments/` - Controllers HTML
- `app/controllers/concerns/` - Módulos compartilhados (Authenticable, Authorizable, etc.)
- `app/services/` - Lógica de negócio (FirebaseTokenValidator, etc.)
