# 🚀 Guia de Deploy - Backend

## Render.com (Recomendado - Já Configurado)

### Passo a Passo

1. **Criar conta no Render**
   - Acesse: https://render.com
   - Faça login com GitHub

2. **Criar novo Web Service**
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub: `laisrod/PaLeva`
   - Render detectará automaticamente o arquivo `render.yaml`

3. **Configurar Variáveis de Ambiente**
   - Vá em "Environment" no dashboard do serviço
   - Adicione:
     ```
     RAILS_MASTER_KEY=<sua-chave-master>
     ```
   - Para obter a chave: `cat backend/config/master.key` (se existir)
   - Ou gere uma nova: `cd backend && EDITOR="code --wait" rails credentials:edit`

4. **Deploy**
   - Render fará o deploy automaticamente
   - O banco PostgreSQL será criado automaticamente (plano free)

5. **Acessar**
   - URL será: `https://paleva-backend.onrender.com` (ou similar)
   - Teste: `https://sua-url.onrender.com/api/v1/is_signed_in`

### Importante

- **Plano Free**: O serviço "dorme" após 15min de inatividade (primeira requisição pode demorar ~30s)
- **Upgrade**: Para evitar sleep, upgrade para plano pago ($7/mês)
- **Database**: PostgreSQL é criado automaticamente via `render.yaml`

---

## Railway.app (Alternativa Simples)

### Passo a Passo

1. **Criar conta**
   - Acesse: https://railway.app
   - Login com GitHub

2. **Novo Projeto**
   - "New Project" → "Deploy from GitHub repo"
   - Selecione `laisrod/PaLeva`

3. **Configurar**
   - Railway detecta Rails automaticamente
   - Adicione variável: `RAILS_MASTER_KEY`
   - Railway cria PostgreSQL automaticamente

4. **Deploy**
   - Deploy automático após push

---

## Fly.io (Para Docker)

### Passo a Passo

```bash
# 1. Instalar CLI
curl -L https://fly.io/install.sh | sh

# 2. Login
fly auth login

# 3. No diretório backend
cd backend
fly launch

# 4. Seguir assistente
# - Nome da app
# - Região (escolha mais próxima)
# - PostgreSQL: Yes
# - Redis: No (por enquanto)

# 5. Adicionar secrets
fly secrets set RAILS_MASTER_KEY=<sua-chave>

# 6. Deploy
fly deploy
```

---

## Configurações Necessárias

### Variáveis de Ambiente Obrigatórias

```bash
RAILS_ENV=production
RAILS_MASTER_KEY=<sua-chave-master>
DATABASE_URL=<fornecido-automaticamente-pelo-serviço>
```

### Variáveis Opcionais

```bash
# Para CORS (se frontend estiver em outro domínio)
ALLOWED_ORIGINS=https://seu-frontend.com

# Para Action Cable (WebSocket)
CABLE_URL=wss://sua-api.com/cable
```

---

## Testando o Deploy

Após o deploy, teste os endpoints:

```bash
# Health check
curl https://sua-url.com/api/v1/is_signed_in

# Deve retornar: {"signed_in":false}
```

---

## Troubleshooting

### Erro: "RAILS_MASTER_KEY missing"
- Adicione a variável de ambiente no painel do serviço
- Obtenha a chave de: `backend/config/master.key`

### Erro: "Database connection failed"
- Verifique se o PostgreSQL foi criado
- No Render: vá em "Databases" e crie um novo PostgreSQL
- Atualize `DATABASE_URL` no serviço web

### Erro: "Port already in use"
- Render/Railway fornecem a porta via `PORT` env var
- Verifique `config/puma.rb` - já está configurado para usar `ENV['PORT']`

### Migrations não rodam
- No Render: adicione no "Start Command":
  ```bash
  bundle exec rails db:migrate && bundle exec puma -C config/puma.rb
  ```

---

## Próximos Passos

1. ✅ Deploy backend no Render
2. ⬜ Atualizar frontend com URL da API
3. ⬜ Configurar CORS no backend
4. ⬜ Deploy frontend (Vercel/GitHub Pages)

---

**Dica**: Render.com é a opção mais fácil pois já está totalmente configurado! 🎉
