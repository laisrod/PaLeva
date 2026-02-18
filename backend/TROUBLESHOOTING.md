# 🔧 Troubleshooting - Backend no Render

## Erro 500 Internal Server Error

### 1. Verificar Logs no Render

1. Acesse o dashboard do Render
2. Vá em "Logs" do seu serviço
3. Procure por erros recentes

### 2. Verificar Variáveis de Ambiente

No Render, vá em "Environment" e verifique:

#### Obrigatórias:
- ✅ `RAILS_ENV=production`
- ✅ `RAILS_MASTER_KEY` (obter de `backend/config/master.key` ou gerar nova)
- ✅ `DATABASE_URL` (deve ser criado automaticamente pelo PostgreSQL)

#### Como obter RAILS_MASTER_KEY:

```bash
# Localmente, no diretório backend
cat config/master.key

# Ou gerar uma nova
EDITOR="code --wait" rails credentials:edit
# Depois copiar a chave gerada
```

### 3. Verificar Migrations

As migrations devem ser executadas automaticamente pelo `render.yaml`, mas verifique:

1. No Render, vá em "Shell" do serviço
2. Execute:
```bash
cd backend
bundle exec rails db:migrate RAILS_ENV=production
```

### 4. Verificar Database

1. No Render, vá em "Databases"
2. Verifique se o PostgreSQL está rodando
3. Verifique se `DATABASE_URL` está configurada no serviço web

### 5. Erros Comuns

#### Erro: "RAILS_MASTER_KEY missing"
**Solução**: Adicione a variável `RAILS_MASTER_KEY` no painel do Render

#### Erro: "Database connection failed"
**Solução**: 
1. Crie um PostgreSQL no Render
2. Adicione `DATABASE_URL` no serviço web (deve ser automático)

#### Erro: "Table doesn't exist"
**Solução**: Execute as migrations:
```bash
bundle exec rails db:migrate RAILS_ENV=production
```

#### Erro: "No such file or directory"
**Solução**: Verifique se o `render.yaml` está configurado corretamente

### 6. Testar Endpoints

Após o deploy, teste:

```bash
# Health check
curl https://sua-url.onrender.com/api/v1/is_signed_in

# Deve retornar: {"signed_in":false}
```

### 7. Habilitar Logs Detalhados (Temporariamente)

No `production.rb`, altere temporariamente:

```ruby
config.consider_all_requests_local = true  # Mostra erros detalhados
config.log_level = :debug  # Mais logs
```

**⚠️ IMPORTANTE**: Reverta depois de debugar!

### 8. Verificar CORS

Se o frontend estiver em outro domínio, configure CORS:

No `config/initializers/cors.rb` ou `config/application.rb`:

```ruby
config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'  # Em produção, use o domínio específico
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

### 9. Comandos Úteis no Render Shell

```bash
# Verificar variáveis de ambiente
env | grep RAILS
env | grep DATABASE

# Verificar se Rails está funcionando
bundle exec rails console
# No console:
User.count
# Deve retornar número de usuários

# Verificar logs em tempo real
tail -f log/production.log
```

### 10. Rebuild do Serviço

Se nada funcionar:

1. No Render, vá em "Manual Deploy"
2. Clique em "Clear build cache & deploy"
3. Aguarde o rebuild completo

---

## Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] `RAILS_MASTER_KEY` configurada
- [ ] `DATABASE_URL` configurada (automático com PostgreSQL)
- [ ] `RAILS_ENV=production` configurada
- [ ] Migrations executadas
- [ ] `render.yaml` está na raiz do repositório
- [ ] Código commitado e pushado para GitHub

---

## Suporte

Se o problema persistir:

1. Verifique os logs completos no Render
2. Teste localmente com `RAILS_ENV=production`
3. Verifique se todas as gems estão no `Gemfile`
4. Verifique se não há dependências faltando
