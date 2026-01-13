# 📚 Fluxo Completo: Backend → Frontend - Módulo Owner

## 🎯 Objetivo
Este documento explica como funciona o fluxo de dados do **Backend Rails** para o **Frontend React** na área do **Owner** (Proprietário do Estabelecimento).

---

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura do Backend](#estrutura-do-backend)
3. [Estrutura do Frontend](#estrutura-do-frontend)
4. [Fluxo Completo de uma Requisição](#fluxo-completo-de-uma-requisição)
5. [Exemplo Prático: Criar um Prato](#exemplo-prático-criar-um-prato)
6. [Arquitetura de Dados](#arquitetura-de-dados)
7. [Autenticação e Autorização](#autenticação-e-autorização)

---

## 🗺️ Visão Geral

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   FRONTEND      │         │   VITE PROXY    │         │   BACKEND       │
│   (React)       │ ──────► │   (Porta 5176)  │ ──────► │   (Rails)       │
│   Porta 5176    │         │                 │         │   Porta 3000    │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

**O que acontece:**
1. Usuário clica em um botão no Frontend
2. Frontend faz uma requisição HTTP
3. Vite (servidor de desenvolvimento) redireciona para o Backend
4. Backend processa e retorna dados em JSON
5. Frontend recebe e atualiza a tela

---

## 🏗️ Estrutura do Backend

### Localização
```
backend/
└── app/
    ├── controllers/
    │   └── api/
    │       └── v1/              ← Controllers da API
    │           ├── establishments_controller.rb
    │           ├── menus_controller.rb
    │           ├── dishes_controller.rb
    │           ├── drinks_controller.rb
    │           ├── tags_controller.rb
    │           ├── orders_controller.rb
    │           └── working_hours_controller.rb
    │
    └── models/                  ← Modelos de dados
        ├── establishment.rb
        ├── menu.rb
        ├── dish.rb
        ├── drink.rb
        └── tag.rb
```

### O que são Controllers?
Controllers são classes Ruby que **recebem requisições HTTP** e **retornam respostas**.

**Exemplo: DishesController**
```ruby
# backend/app/controllers/api/v1/dishes_controller.rb

def create
  @dish = @establishment.dishes.new(dish_params)
  
  if @dish.save
    render json: { dish: @dish, message: 'Sucesso' }
  else
    render json: { error: @dish.errors }
  end
end
```

**O que faz:**
- Recebe dados do frontend
- Cria um novo prato no banco de dados
- Retorna JSON com sucesso ou erro

### Rotas da API
As rotas estão definidas em `config/routes.rb`:

```ruby
namespace :api do
  namespace :v1 do
    resources :establishments, param: :code do
      resources :menus, only: [:index, :show, :create]
      resources :dishes, only: [:index, :show, :create]
      resources :drinks, only: [:index, :show, :create]
      resources :tags, only: [:index, :create]
      resources :orders, only: [:index, :show]
      resources :working_hours, only: [:index, :update]
    end
  end
end
```

**Rotas geradas:**
- `GET /api/v1/establishments/:code/menus` → Lista cardápios
- `POST /api/v1/establishments/:code/dishes` → Cria prato
- `GET /api/v1/establishments/:code/dishes` → Lista pratos
- etc.

---

## 🎨 Estrutura do Frontend

### Localização
```
frontend/src/owner/
├── pages/              ← Telas (o que o usuário vê)
│   ├── CreateDish.tsx
│   ├── CreateDrink.tsx
│   ├── Dashboard.tsx
│   └── ...
│
├── hooks/              ← Lógica de negócio
│   ├── useCreateDish.ts
│   ├── useCreateDrink.ts
│   └── ...
│
├── services/           ← Comunicação com API
│   └── api.ts
│
└── components/         ← Componentes reutilizáveis
    └── Layout.tsx
```

### O que é cada parte?

#### 1. **Pages** (Páginas)
São os componentes que o usuário vê na tela. **Só fazem renderização**.

**Exemplo: CreateDish.tsx**
```typescript
export default function CreateDish() {
  const { formData, handleChange, handleSubmit } = useCreateDish(...)
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={formData.name} onChange={handleChange} />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

#### 2. **Hooks** (Ganchos)
Contêm toda a **lógica de negócio**: validação, requisições, estados.

**Exemplo: useCreateDish.ts**
```typescript
export function useCreateDish() {
  const [formData, setFormData] = useState({ name: '', ... })
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async () => {
    const response = await ownerApi.createDish(...)
    // Processa resposta...
  }
  
  return { formData, handleSubmit, loading }
}
```

#### 3. **Services** (Serviços)
Fazem as **requisições HTTP** para o backend.

**Exemplo: api.ts**
```typescript
class OwnerApiService {
  async createDish(establishmentCode, dishData) {
    const response = await fetch(`/api/v1/establishments/${code}/dishes`, {
      method: 'POST',
      body: JSON.stringify(dishData)
    })
    return response.json()
  }
}
```

---

## 🔄 Fluxo Completo de uma Requisição

### Passo a Passo: Criar um Prato

#### **1. Usuário preenche o formulário**
```
Frontend: CreateDish.tsx
├── Usuário digita "Pizza Margherita"
├── handleChange atualiza formData
└── Estado: { name: "Pizza Margherita", ... }
```

#### **2. Usuário clica em "Salvar"**
```
Frontend: CreateDish.tsx
└── onSubmit → handleSubmit (do hook)
```

#### **3. Hook valida os dados**
```
Frontend: useCreateDish.ts
├── validateForm() verifica se nome está preenchido
├── Se válido: continua
└── Se inválido: mostra erros e para
```

#### **4. Hook prepara os dados**
```
Frontend: useCreateDish.ts
└── prepareDishData() transforma formData em formato da API
    {
      name: "Pizza Margherita",
      description: "...",
      tag_ids: [1, 2]
    }
```

#### **5. Hook chama o serviço de API**
```
Frontend: useCreateDish.ts
└── ownerApi.createDish(establishmentCode, dishData)
    ↓
Frontend: services/api.ts
└── fetch('/api/v1/establishments/ABC123/dishes', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer TOKEN' },
      body: FormData
    })
```

#### **6. Vite Proxy redireciona**
```
Vite (vite.config.js)
└── Proxy: /api → http://localhost:3000
    Requisição vai para: http://localhost:3000/api/v1/...
```

#### **7. Backend recebe a requisição**
```
Backend: routes.rb
└── POST /api/v1/establishments/:code/dishes
    ↓
Backend: DishesController#create
├── Busca estabelecimento pelo código
├── Cria novo prato: Dish.new(dish_params)
├── Salva no banco: dish.save
└── Retorna JSON
```

#### **8. Backend retorna resposta**
```json
{
  "dish": {
    "id": 1,
    "name": "Pizza Margherita",
    "description": "..."
  },
  "message": "Prato criado com sucesso"
}
```

#### **9. Frontend recebe e processa**
```
Frontend: services/api.ts
└── response.json() → { dish: {...}, message: "..." }
    ↓
Frontend: useCreateDish.ts
├── Verifica se response.data existe
├── Se sim: navega para /dishes (sucesso)
└── Se não: mostra erros
```

#### **10. Tela atualiza**
```
Frontend: CreateDish.tsx
└── Navegação: navigate('/establishment/ABC123/dishes')
    Usuário vê a lista de pratos atualizada
```

---

## 📝 Exemplo Prático: Criar um Prato

### Arquivos Envolvidos

#### **Frontend**

**1. Página (UI)**
```typescript
// pages/CreateDish.tsx
export default function CreateDish() {
  const { formData, handleChange, handleSubmit } = useCreateDish(...)
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

**2. Hook (Lógica)**
```typescript
// hooks/useCreateDish.ts
export function useCreateDish() {
  const handleSubmit = async () => {
    const dishData = prepareDishData()
    const response = await ownerApi.createDish(code, dishData)
    // Processa resposta...
  }
}
```

**3. Serviço (API)**
```typescript
// services/api.ts
async createDish(establishmentCode, dishData) {
  return fetch(`/api/v1/establishments/${code}/dishes`, {
    method: 'POST',
    body: FormData
  })
}
```

#### **Backend**

**1. Rota**
```ruby
# config/routes.rb
resources :establishments, param: :code do
  resources :dishes, only: [:create]
end
```

**2. Controller**
```ruby
# controllers/api/v1/dishes_controller.rb
def create
  @dish = @establishment.dishes.new(dish_params)
  if @dish.save
    render json: { dish: @dish }
  else
    render json: { error: @dish.errors }
  end
end
```

**3. Model**
```ruby
# models/dish.rb
class Dish < ApplicationRecord
  belongs_to :establishment
  has_many :dish_tags
  has_many :tags, through: :dish_tags
end
```

---

## 🗄️ Arquitetura de Dados

### Modelo de Dados (Backend)

```
User (Usuário)
  └── has_one :establishment
  
Establishment (Estabelecimento)
  ├── belongs_to :user
  ├── has_many :menus
  ├── has_many :dishes
  ├── has_many :drinks
  ├── has_many :tags
  ├── has_many :orders
  └── has_many :working_hours

Menu (Cardápio)
  ├── belongs_to :establishment
  └── has_many :menu_items

Dish (Prato)
  ├── belongs_to :establishment
  └── has_many :tags (through dish_tags)

Drink (Bebida)
  └── belongs_to :establishment

Tag (Característica)
  └── has_many :dishes (through dish_tags)

Order (Pedido)
  └── belongs_to :establishment
```

### Fluxo de Dados

```
┌──────────────┐
│   BANCO      │
│   DE DADOS   │
│   (PostgreSQL)│
└──────┬───────┘
       │
       │ ActiveRecord (ORM)
       │
┌──────▼───────┐
│   MODELS     │
│   (Ruby)     │
└──────┬───────┘
       │
       │ Métodos (save, find, etc)
       │
┌──────▼───────┐
│ CONTROLLERS  │
│   (Ruby)     │
└──────┬───────┘
       │
       │ render json: {...}
       │
┌──────▼───────┐
│   HTTP       │
│   Response   │
│   (JSON)     │
└──────┬───────┘
       │
       │ fetch() / axios()
       │
┌──────▼───────┐
│  SERVICES    │
│  (TypeScript)│
└──────┬───────┘
       │
       │ Retorna dados
       │
┌──────▼───────┐
│    HOOKS     │
│  (React)     │
└──────┬───────┘
       │
       │ useState, setState
       │
┌──────▼───────┐
│   PAGES      │
│  (React)     │
└──────────────┘
```

---

## 🔐 Autenticação e Autorização

### Como Funciona

#### **1. Login**
```
Frontend: Login.tsx
└── api.signIn(email, password)
    ↓
Backend: SessionsController#create
├── Verifica credenciais
├── Gera token: user.api_token
└── Retorna: { token: "ABC123...", user: {...} }
    ↓
Frontend: Salva token no localStorage
└── localStorage.setItem('auth_token', token)
```

#### **2. Requisições Autenticadas**
```
Frontend: services/api.ts
└── headers: { 'Authorization': 'Bearer TOKEN' }
    ↓
Backend: ApplicationController
└── before_action :authenticate_api_user!
    ├── Lê token do header
    ├── Busca usuário: User.find_by(api_token: token)
    └── Se não encontrar: retorna 401 (não autorizado)
```

#### **3. Verificação de Propriedade**
```
Backend: Controllers
└── before_action :set_establishment
    ├── Busca: Establishment.find_by(code: params[:code])
    └── Verifica se current_user é dono
```

---

## 📊 Resumo das Funcionalidades Owner

### Funcionalidades Disponíveis

| Funcionalidade | Frontend (Page) | Frontend (Hook) | Backend (Controller) | Backend (Model) |
|----------------|-----------------|----------------|----------------------|-----------------|
| **Criar Estabelecimento** | CreateEstablishment | useCreateEstablishment | EstablishmentsController#create | Establishment |
| **Dashboard** | Dashboard | useEstablishment | EstablishmentsController#show | Establishment |
| **Criar Cardápio** | CreateMenu | useCreateMenu | MenusController#create | Menu |
| **Listar Cardápios** | MenusList | useMenus | MenusController#index | Menu |
| **Editar Cardápio** | EditMenu | useEditMenu | MenusController#update | Menu |
| **Criar Prato** | CreateDish | useCreateDish | DishesController#create | Dish |
| **Listar Pratos** | Dishes | useDishes | DishesController#index | Dish |
| **Criar Bebida** | CreateDrink | useCreateDrink | DrinksController#create | Drink |
| **Listar Bebidas** | Drinks | useDrinks | DrinksController#index | Drink |
| **Gerenciar Tags** | Tags | useTags | TagsController#index/create | Tag |
| **Gerenciar Pedidos** | Orders | useOrders | OrdersController#index | Order |
| **Horários** | EditWorkingHours | useWorkingHours | WorkingHoursController#update | WorkingHour |

---

## 🎓 Conceitos Importantes

### 1. **Separação de Responsabilidades**

**Frontend:**
- **Pages**: Apenas renderização (UI)
- **Hooks**: Lógica de negócio
- **Services**: Comunicação HTTP

**Backend:**
- **Controllers**: Recebem requisições e retornam respostas
- **Models**: Regras de negócio e acesso ao banco
- **Routes**: Definem URLs disponíveis

### 2. **Fluxo de Dados Unidirecional**

```
Usuário → Página → Hook → Service → Backend → Banco
                ↑                                    ↓
                └─────────── Resposta ───────────────┘
```

### 3. **Estados no Frontend**

- **formData**: Dados do formulário
- **loading**: Se está carregando
- **errors**: Lista de erros
- **success**: Mensagem de sucesso

### 4. **Tratamento de Erros**

```
Backend retorna: { error: "Nome é obrigatório" }
    ↓
Frontend (Service): Recebe JSON
    ↓
Frontend (Hook): getErrorMessage(response)
    ↓
Frontend (Page): Mostra erro na tela
```

---

## 🚀 Como Testar o Fluxo

### 1. Iniciar Backend
```bash
cd backend
rails server
# Servidor roda em http://localhost:3000
```

### 2. Iniciar Frontend
```bash
cd frontend
npm run dev
# Servidor roda em http://localhost:5176
```

### 3. Testar uma Requisição

**No navegador (DevTools → Network):**
1. Abra a página de criar prato
2. Preencha o formulário
3. Clique em "Salvar"
4. Veja a requisição POST sendo feita
5. Veja a resposta JSON do backend

---

## 📌 Pontos-Chave para a Demo

1. **Arquitetura em Camadas**: Frontend separado do Backend
2. **API RESTful**: Comunicação via HTTP/JSON
3. **Separação de Responsabilidades**: Pages, Hooks, Services
4. **TypeScript**: Tipagem forte no frontend
5. **React Hooks**: Reutilização de lógica
6. **Autenticação**: Token-based authentication
7. **Tratamento de Erros**: Em todas as camadas
8. **Validação**: No frontend e backend

---

## 🔍 Exemplo de Requisição Real

### Request (Frontend → Backend)
```http
POST /api/v1/establishments/ABC123/dishes HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "dish": {
    "name": "Pizza Margherita",
    "description": "Pizza com molho de tomate e mussarela",
    "calories": 350,
    "tag_ids": [1, 2]
  }
}
```

### Response (Backend → Frontend)
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "dish": {
    "id": 1,
    "name": "Pizza Margherita",
    "description": "Pizza com molho de tomate e mussarela",
    "calories": 350
  },
  "message": "Prato criado com sucesso"
}
```

---

## ✅ Checklist para Entender o Fluxo

- [ ] Entendeu que o Frontend faz requisições HTTP
- [ ] Entendeu que o Backend processa e retorna JSON
- [ ] Entendeu a separação: Pages (UI) → Hooks (Lógica) → Services (API)
- [ ] Entendeu como a autenticação funciona (token)
- [ ] Entendeu o fluxo de validação (frontend e backend)
- [ ] Entendeu como os dados fluem do banco até a tela

---

**Fim do Documento** 🎉
