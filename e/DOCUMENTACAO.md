# 📚 Documentação: Como o Frontend Owner se Comunica com o Backend

## 🎯 Visão Geral

Este documento explica de forma simples e didática como a aplicação **PaLeva** funciona, focando na comunicação entre o **Frontend (React)** e o **Backend (Ruby on Rails)**.

---

## 🏗️ Arquitetura da Aplicação

```
┌─────────────────┐         HTTP/REST         ┌─────────────────┐
│   Frontend      │ ◄────────────────────────► │   Backend       │
│   (React)       │     Requisições JSON       │   (Rails API)   │
│   Porta 5177    │                             │   Porta 3000    │
└─────────────────┘                             └─────────────────┘
```

### Componentes Principais:

1. **Páginas (Pages)**: Componentes React que o usuário vê na tela
2. **Hooks Customizados**: Lógica reutilizável para buscar dados
3. **Serviço de API**: Classe que faz as requisições HTTP ao backend
4. **Backend Rails**: API REST que processa as requisições e retorna dados

---

## 🔄 Fluxo de Dados Completo

### Exemplo: Carregar Dados de um Estabelecimento

Vamos acompanhar o que acontece quando o usuário acessa o Dashboard:

```
1. Usuário acessa /establishment/ABC123
   ↓
2. Componente Dashboard.tsx é renderizado
   ↓
3. Hook useEstablishment() é chamado
   ↓
4. Hook verifica autenticação (useAuthCheck)
   ↓
5. Hook faz requisição via api.getEstablishment()
   ↓
6. Serviço API envia HTTP GET para /api/v1/establishments/ABC123
   ↓
7. Backend Rails processa a requisição
   ↓
8. Backend retorna JSON com os dados
   ↓
9. Hook atualiza o estado com os dados
   ↓
10. Componente re-renderiza com os dados
```

---

## 📁 Estrutura de Pastas

```
frontend/src/owner/
├── pages/              # Páginas que o usuário vê
│   ├── Dashboard.tsx   # Tela principal
│   ├── CreateDish.tsx  # Criar prato
│   └── ...
├── hooks/              # Lógica reutilizável
│   ├── useEstablishment.ts
│   ├── useDishes.ts
│   └── utils/          # Utilitários compartilhados
│       ├── useAuthCheck.ts
│       ├── useApiData.ts
│       └── errorHandler.ts
└── components/         # Componentes reutilizáveis
    └── Layout.tsx
```

---

## 🔐 Sistema de Autenticação

### Como Funciona:

1. **Login**: Usuário digita email e senha
2. **Frontend envia** dados para `/api/v1/sign_in`
3. **Backend valida** e retorna um **token** (string única)
4. **Frontend salva** o token no `localStorage`
5. **Próximas requisições** incluem o token no cabeçalho `Authorization`

### Exemplo de Código:

```typescript
// 1. Usuário faz login
const response = await api.signIn(email, password)

// 2. Token é salvo automaticamente
// localStorage.setItem('auth_token', token)

// 3. Próximas requisições incluem o token
// headers: { 'Authorization': 'Bearer abc123...' }
```

### Verificação de Autenticação:

O hook `useAuthCheck` verifica se o usuário está logado antes de carregar dados:

```typescript
// Se não houver token, redireciona para /login
useAuthCheck()
```

---

## 🎣 Hooks Customizados

### O que são Hooks?

Hooks são funções que encapsulam lógica e estado. Eles permitem reutilizar código entre diferentes componentes.

### Hook Exemplo: `useEstablishment`

```typescript
// Como usar na página
const { establishment, loading, error } = useEstablishment(code)

// O hook faz tudo automaticamente:
// ✅ Verifica autenticação
// ✅ Faz requisição ao backend
// ✅ Gerencia loading e erros
// ✅ Retorna os dados prontos
```

### Estrutura de um Hook:

```typescript
export function useEstablishment(code: string | undefined) {
  // 1. Verifica autenticação
  useAuthCheck()
  
  // 2. Define estados
  const [establishment, setEstablishment] = useState(null)
  const { loading, error, executeRequest } = useApiData()
  
  // 3. Carrega dados quando o código muda
  useEffect(() => {
    if (code) {
      loadEstablishment(code)
    }
  }, [code])
  
  // 4. Retorna dados para o componente
  return { establishment, loading, error }
}
```

---

## 🌐 Serviço de API

### Classe `ApiService`

Esta classe centraliza todas as comunicações com o backend.

### Como Funciona:

```typescript
class ApiService {
  // Método privado para fazer requisições
  private async request<T>(endpoint: string, options: RequestInit) {
    // 1. Pega o token de autenticação
    const token = localStorage.getItem('auth_token')
    
    // 2. Configura cabeçalhos
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Token no cabeçalho
    }
    
    // 3. Faz a requisição HTTP
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE',
      headers,
      body: JSON.stringify(data)  // Se for POST/PUT
    })
    
    // 4. Converte resposta para JSON
    const data = await response.json()
    
    // 5. Retorna dados ou erro
    return { data, error }
  }
  
  // Métodos públicos específicos
  async getEstablishment(code: string) {
    return this.request(`/establishments/${code}`)
  }
}
```

### Endpoints Disponíveis:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/establishments/:code` | Buscar estabelecimento |
| POST | `/api/v1/establishments` | Criar estabelecimento |
| GET | `/api/v1/establishments/:code/dishes` | Listar pratos |
| POST | `/api/v1/establishments/:code/dishes` | Criar prato |
| GET | `/api/v1/establishments/:code/menus` | Listar cardápios |
| POST | `/api/v1/establishments/:code/menus` | Criar cardápio |
| POST | `/api/v1/sign_in` | Login |
| DELETE | `/api/v1/sign_out` | Logout |

---

## 📝 Exemplo Completo: Dashboard

Vamos ver como tudo funciona junto no componente Dashboard:

### 1. O Componente (Dashboard.tsx)

```typescript
export default function Dashboard() {
  // Pega o código da URL: /establishment/ABC123
  const { code } = useParams<{ code: string }>()
  
  // Usa o hook para buscar dados
  const { establishment, loading, error } = useEstablishment(code)
  
  // Enquanto carrega, mostra loading
  if (loading) {
    return <p>Carregando...</p>
  }
  
  // Se houver erro, mostra mensagem
  if (error) {
    return <p>{error}</p>
  }
  
  // Mostra os dados
  return (
    <div>
      <h1>{establishment.name}</h1>
      <p>{establishment.phone_number}</p>
    </div>
  )
}
```

### 2. O Hook (useEstablishment.ts)

```typescript
export function useEstablishment(code: string | undefined) {
  // Verifica se usuário está logado
  useAuthCheck()
  
  // Estado para armazenar os dados
  const [establishment, setEstablishment] = useState(null)
  
  // Hook genérico para requisições
  const { loading, error, executeRequest } = useApiData({
    onSuccess: (data) => setEstablishment(data)  // Quando dados chegam
  })
  
  // Função para buscar dados
  const loadEstablishment = async (code: string) => {
    await executeRequest(() => api.getEstablishment(code))
  }
  
  // Carrega dados quando código muda
  useEffect(() => {
    if (code) {
      loadEstablishment(code)
    }
  }, [code])
  
  // Retorna para o componente usar
  return { establishment, loading, error }
}
```

### 3. O Serviço API (api.ts)

```typescript
class ApiService {
  async getEstablishment(code: string) {
    // Faz requisição HTTP GET
    return this.request(`/establishments/${code}`)
  }
}
```

### 4. Requisição HTTP Real

```
GET /api/v1/establishments/ABC123
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

Response:
{
  "data": {
    "id": 1,
    "name": "Restaurante do João",
    "code": "ABC123",
    "phone_number": "(11) 98765-4321",
    "working_hours": [...]
  }
}
```

---

## 🛠️ Utilitários Compartilhados

Para evitar repetição de código (princípio DRY), criamos utilitários:

### 1. `useAuthCheck` - Verifica Autenticação

```typescript
// Todos os hooks usam isso para garantir que usuário está logado
useAuthCheck()  // Redireciona para /login se não tiver token
```

### 2. `useApiData` - Hook Genérico para Requisições

```typescript
// Gerencia loading, error e faz requisições automaticamente
const { loading, error, executeRequest } = useApiData({
  defaultErrorMessage: 'Erro ao carregar dados',
  onSuccess: (data) => {
    // Faz algo quando dados chegam
  }
})
```

### 3. `errorHandler` - Trata Erros

```typescript
// Converte erros da API (pode ser string ou array) em string única
const errorMessage = getErrorMessage(response)
// Retorna: "Email já está em uso" ou "Erro 1, Erro 2"
```

---

## 🎨 Estados e Loading

### Estados Comuns nos Hooks:

1. **`loading`**: `true` enquanto busca dados
2. **`error`**: Mensagem de erro se algo der errado
3. **`data`**: Dados retornados do backend

### Exemplo de Uso:

```typescript
const { establishment, loading, error } = useEstablishment(code)

// Estado 1: Carregando
if (loading) return <p>Carregando...</p>

// Estado 2: Erro
if (error) return <p>Erro: {error}</p>

// Estado 3: Sucesso
return <div>{establishment.name}</div>
```

---

## 📊 Fluxo de Criação de Dados

Exemplo: Criar um novo prato

```typescript
// 1. Usuário preenche formulário em CreateDish.tsx
const handleSubmit = async (e) => {
  e.preventDefault()
  
  // 2. Chama serviço de API
  const response = await api.createDish(code, dishData)
  
  // 3. Verifica se deu certo
  if (response.error) {
    setErrors([response.error])  // Mostra erro
  } else {
    navigate(`/establishment/${code}/dishes`)  // Vai para lista
  }
}
```

**Requisição HTTP:**
```
POST /api/v1/establishments/ABC123/dishes
Headers:
  Authorization: Bearer token...
  Content-Type: application/json
Body:
{
  "dish": {
    "name": "Pizza Margherita",
    "description": "Pizza com molho, queijo e manjericão",
    "calories": 350
  }
}
```

**Resposta do Backend:**
```json
{
  "dish": {
    "id": 42,
    "name": "Pizza Margherita",
    "description": "Pizza com molho, queijo e manjericão",
    "calories": 350
  },
  "message": "Prato criado com sucesso"
}
```

---

## 🚨 Tratamento de Erros

### Como Erros são Tratados:

1. **Frontend detecta erro** na resposta da API
2. **Hook atualiza estado** `error`
3. **Componente mostra mensagem** para o usuário

### Tipos de Erros:

```typescript
// Erro de validação (backend retorna array)
{
  "errors": ["Nome não pode ficar em branco", "Calorias inválidas"]
}

// Erro simples (backend retorna string)
{
  "error": "Estabelecimento não encontrado"
}

// Erro de rede (fetch falha)
catch (err) {
  setError("Erro ao conectar com servidor")
}
```

---

## 🔑 Conceitos Importantes

### 1. **Token de Autenticação**
- String única que identifica o usuário logado
- Enviada em TODAS as requisições protegidas
- Armazenada no `localStorage` do navegador

### 2. **REST API**
- Padrão de comunicação entre frontend e backend
- Métodos HTTP: GET (ler), POST (criar), PUT (atualizar), DELETE (remover)
- Dados no formato JSON

### 3. **Hooks React**
- Permitem usar estado e efeitos em componentes funcionais
- Custom hooks encapsulam lógica reutilizável
- Facilitam organização e manutenção

### 4. **Estado Assíncrono**
- Requisições HTTP são assíncronas (levam tempo)
- Usamos `async/await` para esperar respostas
- Estados `loading` informam que está carregando

---

## 📋 Checklist para Entender o Código

- [ ] Entende o que é uma API REST
- [ ] Sabe como funciona autenticação com token
- [ ] Compreende o que são hooks do React
- [ ] Conhece a estrutura de pastas do projeto
- [ ] Entende o fluxo: Página → Hook → API → Backend
- [ ] Sabe como erros são tratados
- [ ] Compreende estados de loading, error e success

---

## 🎓 Recursos para Aprender Mais

1. **React Hooks**: Documentação oficial do React
2. **Fetch API**: Como fazer requisições HTTP em JavaScript
3. **REST API**: Conceitos de APIs RESTful
4. **TypeScript**: Tipagem estática em JavaScript
5. **Async/Await**: Programação assíncrona em JavaScript

---

## 💡 Resumo Rápido

```
Usuário acessa página
    ↓
Componente React renderiza
    ↓
Hook customizado é chamado
    ↓
Hook verifica autenticação
    ↓
Hook chama serviço de API
    ↓
Serviço faz requisição HTTP ao backend
    ↓
Backend processa e retorna JSON
    ↓
Hook atualiza estado com dados
    ↓
Componente re-renderiza mostrando dados
```

---

**Criado para:** Apresentação de demonstração  
**Projeto:** PaLeva - Sistema de Gestão de Restaurantes  
**Data:** 2025

