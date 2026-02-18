# 🔧 Configuração Manual do Render - Backend

## ⚠️ Problema: Migrations não estão rodando automaticamente

Se as migrations não estão sendo executadas automaticamente, configure manualmente no dashboard do Render.

## 📋 Passo a Passo

### 1. Acessar Configurações do Serviço

1. Acesse: https://dashboard.render.com/
2. Clique no serviço `paleva-backend`
3. Vá em **"Settings"** (Configurações)

### 2. Configurar Root Directory

1. Role até **"Root Directory"**
2. Defina como: `backend`
3. Clique em **"Save Changes"**

### 3. Configurar Build Command

1. Role até **"Build Command"**
2. Defina como:
   ```bash
   bundle install
   ```
3. Clique em **"Save Changes"**

### 4. Configurar Start Command (IMPORTANTE!)

1. Role até **"Start Command"**
2. **APAGUE** qualquer comando existente
3. Cole este comando (mais robusto, com verificações):
   ```bash
   bundle exec rails db:create RAILS_ENV=production 2>&1 || echo "Database may exist" && bundle exec rails db:migrate RAILS_ENV=production 2>&1 && bundle exec rails runner "exit(ActiveRecord::Base.connection.table_exists?('users') ? 0 : 1)" RAILS_ENV=production && echo "✅ Migrations verified!" && bundle exec puma -C config/puma.rb
   ```
   
   **OU** (versão mais simples, se a anterior não funcionar):
   ```bash
   bundle exec rails db:prepare RAILS_ENV=production 2>&1; if [ $? -eq 0 ]; then bundle exec puma -C config/puma.rb; else echo "❌ Migrations failed!"; exit 1; fi
   ```

4. Clique em **"Save Changes"**

### 5. Verificar Variáveis de Ambiente

1. Vá em **"Environment"**
2. Verifique se existem:
   - ✅ `RAILS_ENV` = `production`
   - ✅ `RAILS_MASTER_KEY` = `<sua-chave>` (obter de `backend/config/master.key`)
   - ✅ `DATABASE_URL` = (deve estar configurada automaticamente pelo PostgreSQL)

### 6. Fazer Deploy Manual

1. Vá em **"Manual Deploy"**
2. Selecione **"Clear build cache & deploy"**
3. Clique em **"Deploy latest commit"**

### 7. Verificar Logs

1. Durante o deploy, vá em **"Logs"**
2. Procure por:
   ```
   Running database migrations...
   == 20241022153850 CreateUser: migrating ======================================
   == 20241022153850 CreateUser: migrated (0.xxxxs) ==============================
   ✅ Migrations completed successfully!
   ```

## 🔍 Troubleshooting

### Se ainda der erro "users does not exist"

1. **Verifique os logs** - veja se as migrations estão sendo executadas
2. **Verifique o Root Directory** - deve ser `backend`
3. **Verifique o Start Command** - deve incluir `rails db:prepare` ou `rails db:migrate`
4. **Verifique DATABASE_URL** - deve estar configurada

### Comando alternativo para Start Command

Se o comando acima não funcionar, tente este (mais verboso):

```bash
echo "Starting migrations..." && bundle exec rails db:prepare RAILS_ENV=production 2>&1 && echo "Migrations OK!" && bundle exec puma -C config/puma.rb
```

### Verificar se o banco existe

Se quiser verificar se o PostgreSQL está conectado, use este Start Command temporariamente:

```bash
echo "DATABASE_URL: ${DATABASE_URL:0:50}" && bundle exec rails db:version RAILS_ENV=production && bundle exec rails db:migrate RAILS_ENV=production && bundle exec puma -C config/puma.rb
```

## ✅ Teste Final

Após o deploy, teste:

```
https://paleva-backend.onrender.com/api/v1/is_signed_in
```

Deve retornar: `{"signed_in":false}` (sem erro 500)

---

**Dica**: Se nada funcionar, o problema pode ser que o Render não está detectando o `render.yaml`. Nesse caso, configure tudo manualmente no dashboard seguindo os passos acima.
