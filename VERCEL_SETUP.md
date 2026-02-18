# 🔗 Conectar Frontend (Vercel) com Backend (Render)

## 📋 Passo a Passo

### 1. Obter URL do Backend no Render

1. Acesse: https://dashboard.render.com/
2. Clique no serviço `paleva-backend`
3. Copie a URL (exemplo: `https://paleva-backend.onrender.com`)

### 2. Configurar Variável de Ambiente no Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique no seu projeto `PaLeva` (ou nome do projeto)
3. Vá em **Settings** → **Environment Variables**
4. Adicione a variável:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://paleva-backend.onrender.com/api/v1`
   - **Environments**: Marque todas (Production, Preview, Development)
5. Clique em **Save**

### 3. Configurar CORS no Backend (Render)

1. Acesse: https://dashboard.render.com/
2. Clique no serviço `paleva-backend`
3. Vá em **Environment**
4. Adicione a variável (opcional, mas recomendado):
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `https://seu-projeto.vercel.app,https://seu-projeto-git-main-seu-usuario.vercel.app`
   - Substitua `seu-projeto` pelo nome real do seu projeto no Vercel
5. Clique em **Save Changes**

**OU** deixe como está - o CORS já está configurado para aceitar qualquer domínio `.vercel.app`

### 4. Fazer Novo Deploy no Vercel

1. No Vercel, vá em **Deployments**
2. Clique nos três pontos (...) do último deployment
3. Selecione **Redeploy**
4. Ou faça um novo commit/push para trigger automático

### 5. Verificar se Funcionou

Após o deploy, teste:

1. Acesse seu site no Vercel
2. Abra o Console do navegador (F12)
3. Tente fazer login
4. Verifique se as requisições estão indo para: `https://paleva-backend.onrender.com/api/v1/...`

## 🔍 Troubleshooting

### Erro: "CORS policy blocked"

**Solução**: Verifique se:
- A variável `VITE_API_URL` está configurada no Vercel
- O backend está rodando (teste: `https://paleva-backend.onrender.com/api/v1/is_signed_in`)
- O CORS está permitindo o domínio do Vercel (já está configurado para `.vercel.app`)

### Erro: "Network request failed"

**Solução**: 
- Verifique se a URL do backend está correta
- Verifique se o backend está online (pode estar "dormindo" no plano free)
- Aguarde ~30s na primeira requisição (plano free do Render)

### Erro: "404 Not Found" nas requisições

**Solução**:
- Verifique se `VITE_API_URL` termina com `/api/v1` (sem barra no final)
- Verifique se o backend está respondendo: `https://paleva-backend.onrender.com/api/v1/is_signed_in`

## 📝 Variáveis de Ambiente no Vercel

### Obrigatória:
```
VITE_API_URL=https://paleva-backend.onrender.com/api/v1
```

### Opcional (para WebSocket):
```
VITE_WS_URL=wss://paleva-backend.onrender.com
```

## ✅ Checklist

- [ ] URL do backend copiada do Render
- [ ] Variável `VITE_API_URL` configurada no Vercel
- [ ] Variável `ALLOWED_ORIGINS` configurada no Render (opcional)
- [ ] Novo deploy feito no Vercel
- [ ] Testado no navegador (Console aberto para ver erros)

---

**Dica**: O CORS já está configurado para aceitar qualquer domínio `.vercel.app`, então você não precisa configurar `ALLOWED_ORIGINS` a menos que tenha um domínio customizado.
