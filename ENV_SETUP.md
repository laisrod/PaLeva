# 📁 Onde ficam os arquivos .env

## 📍 Localização dos Arquivos .env

### Backend (Rails)
**Localização:** `backend/.env`

```bash
/home/lais/Projetos/itacademy/sprint 9/PaLeva/backend/.env
```

### Frontend (React/Vite)
**Localização:** `frontend/.env`

```bash
/home/lais/Projetos/itacademy/sprint 9/PaLeva/frontend/.env
```

---

## 🚀 Como Criar os Arquivos .env

### 1. Backend

```bash
# Navegue até a pasta do backend
cd backend

# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com seus valores
nano .env  # ou use seu editor preferido
```

### 2. Frontend

```bash
# Navegue até a pasta do frontend
cd frontend

# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com seus valores
nano .env  # ou use seu editor preferido
```

---

## 📝 Variáveis Importantes

### Backend (.env)

#### Obrigatórias para Desenvolvimento:
```bash
RAILS_ENV=development
PORT=3000
```

#### Opcionais (mas recomendadas):
```bash
# CORS - URLs permitidas
ALLOWED_ORIGINS=http://localhost:5176,http://localhost:3000

# Logs
RAILS_LOG_LEVEL=debug
RAILS_MAX_THREADS=5
```

#### Para OAuth (se implementar):
```bash
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
JWT_SECRET=seu_jwt_secret
```

### Frontend (.env)

#### Obrigatória:
```bash
# URL da API backend
VITE_API_URL=http://localhost:3000/api/v1
```

#### Opcional:
```bash
# WebSocket (se usar)
VITE_WS_URL=ws://localhost:3000
```

---

## ⚠️ Importante

1. **NUNCA commite o arquivo `.env`** - Ele já está no `.gitignore`
2. **Sempre use `.env.example` como template** - Este arquivo pode ser commitado
3. **No Vite, variáveis devem começar com `VITE_`** - Ex: `VITE_API_URL`
4. **No Rails, use `ENV['NOME_VARIAVEL']`** - Ex: `ENV['RAILS_ENV']`

---

## 🔍 Como o Projeto Lê as Variáveis

### Backend (Rails)
Rails lê automaticamente o arquivo `.env` na raiz do projeto backend usando a gem `dotenv` (se instalada) ou através de variáveis de ambiente do sistema.

**Exemplo no código:**
```ruby
# backend/config/database.yml
pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>

# backend/config/initializers/cors.rb
if ENV['ALLOWED_ORIGINS'].present?
  # ...
end
```

### Frontend (Vite)
Vite lê variáveis do arquivo `.env` e expõe apenas as que começam com `VITE_`.

**Exemplo no código:**
```typescript
// frontend/src/shared/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'
```

---

## 🐳 Docker

Se estiver usando Docker, as variáveis podem ser definidas no `docker-compose.yml`:

```yaml
environment:
  - RAILS_ENV=development
  - VITE_API_URL=/api/v1
```

---

## 🌐 Produção

### Render (Backend)
Configure as variáveis de ambiente no painel do Render:
1. Acesse seu serviço no Render
2. Vá em **Environment**
3. Adicione as variáveis necessárias

### Vercel (Frontend)
Configure as variáveis de ambiente no painel do Vercel:
1. Acesse seu projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as variáveis (ex: `VITE_API_URL`)

---

## ✅ Checklist

- [ ] Arquivo `backend/.env.example` criado
- [ ] Arquivo `frontend/.env.example` criado
- [ ] Arquivo `backend/.env` criado (copiado do .example)
- [ ] Arquivo `frontend/.env` criado (copiado do .example)
- [ ] Variáveis preenchidas nos arquivos `.env`
- [ ] Arquivos `.env` estão no `.gitignore` (já estão)
- [ ] Testado localmente

---

## 🔧 Troubleshooting

### Rails não lê o .env
**Solução:** Instale a gem `dotenv-rails`:
```bash
cd backend
bundle add dotenv-rails --group development
```

### Vite não lê variáveis
**Solução:** 
1. Certifique-se de que as variáveis começam com `VITE_`
2. Reinicie o servidor de desenvolvimento (`npm run dev`)
3. Verifique se o arquivo está na pasta `frontend/` (não na raiz)

### Variáveis não aparecem no build
**Solução:** Variáveis do Vite são injetadas em tempo de build. Faça um novo build:
```bash
cd frontend
npm run build
```

---

**Dica:** Use os arquivos `.env.example` como referência e documentação das variáveis disponíveis!
