# 📖 Resumo Executivo - Frontend Owner

## 🎯 O que este código faz?

Este código é o **painel administrativo** do sistema PaLeva, onde donos de restaurantes:
- Gerenciam seus estabelecimentos
- Cadastram pratos e bebidas
- Criam cardápios
- Visualizam pedidos
- Controlam horários de funcionamento

## 🔄 Como Funciona em 5 Passos

1. **Usuário acessa uma página** (ex: Dashboard)
2. **Página usa um Hook** para buscar dados (ex: `useEstablishment`)
3. **Hook faz requisição HTTP** ao backend Rails
4. **Backend retorna dados** em formato JSON
5. **Página exibe os dados** para o usuário

## 📁 Estrutura

```
owner/
├── pages/          → Telas que o usuário vê
├── hooks/          → Lógica para buscar dados
├── components/     → Componentes reutilizáveis
└── DOCUMENTACAO.md → Documentação completa
```

## 🔑 Conceitos Principais

### Hooks Customizados
Funções que encapsulam lógica de busca de dados:
```typescript
const { establishment, loading } = useEstablishment(code)
```

### Autenticação
Sistema de login usando tokens JWT:
- Token salvo no `localStorage`
- Enviado em todas as requisições
- Verificado automaticamente pelos hooks

### API REST
Comunicação com backend via HTTP:
- GET: Buscar dados
- POST: Criar dados
- PUT/PATCH: Atualizar dados
- DELETE: Remover dados

## 📊 Exemplo Prático

**Página Dashboard busca dados do estabelecimento:**

```typescript
// 1. Página usa o hook
const { establishment } = useEstablishment('ABC123')

// 2. Hook faz requisição
GET /api/v1/establishments/ABC123

// 3. Backend retorna
{
  "name": "Restaurante do João",
  "phone": "(11) 98765-4321"
}

// 4. Página exibe
<h1>Restaurante do João</h1>
```

## 🛠️ Tecnologias Usadas

- **React**: Biblioteca JavaScript para criar interfaces
- **TypeScript**: JavaScript com tipagem estática
- **React Router**: Navegação entre páginas
- **Fetch API**: Requisições HTTP
- **localStorage**: Armazenamento local no navegador

## 📚 Para mais detalhes

Consulte o arquivo **DOCUMENTACAO.md** para explicação completa e detalhada.

