# PaLeva

Sistema completo de gestão de restaurantes com interfaces separadas para proprietários e clientes.

## Sobre

PaLeva é uma aplicação fullstack para gerenciar restaurantes, cardápios, pedidos e avaliações. Proprietários têm acesso a um painel de controle completo, enquanto clientes podem navegar pelo cardápio e realizar pedidos em tempo real.

## Funcionalidades

### Para proprietários
- Dashboard com visão geral de pedidos e métricas
- Gerenciamento de pratos, bebidas e sobremesas
- Gerenciamento de cardápios e itens
- Controle de pedidos com atualização de status em tempo real
- Configuração do estabelecimento e horários de funcionamento
- Tags e categorias personalizadas
- Avaliações e reviews dos clientes

### Para clientes
- Listagem de restaurantes disponíveis
- Navegação pelo cardápio com categorias e filtros
- Realização de pedidos
- Histórico de pedidos
- Notificações em tempo real do status do pedido

## Stack

### Backend
- Ruby 3.3.4
- Rails 7.2
- SQLite3 (desenvolvimento) / PostgreSQL (produção)
- Action Cable (WebSockets para tempo real)
- Devise (autenticação)
- RSpec (testes)

### Frontend
- React 19
- TypeScript
- Vite 7
- React Router DOM 7
- Tailwind CSS v4
- Vitest (testes)

## Estrutura do projeto

```
PaLeva/
├── backend/
│   ├── app/
│   │   ├── controllers/api/v1/   # Controllers da API
│   │   ├── models/               # Modelos ActiveRecord
│   │   ├── services/             # Service objects
│   │   ├── channels/             # Action Cable
│   │   └── serializers/          # Serializers de resposta
│   ├── spec/                     # Testes RSpec
│   └── db/                       # Migrations e seeds
│
└── frontend/
    └── src/
        ├── client/               # Area do cliente
        ├── owner/                # Area do proprietario
        │   └── features/         # Organizacao por dominio
        └── shared/               # Codigo compartilhado
```

## Como rodar

### Sem Docker

**Backend**
```bash
cd backend
bundle install
bin/rails db:create db:migrate db:seed
bin/rails server
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Acesse o frontend em `http://localhost:5176` e o backend em `http://localhost:3000`.

### Com Docker

```bash
docker-compose up
docker-compose exec backend bin/rails db:migrate
```

## Credenciais de teste

Apos rodar `rails db:seed`:

| Perfil | Email | Senha |
|---|---|---|
| Proprietario | owner@example.com | testes123456 |
| Cliente | client@example.com | testes123456 |

## API — principais endpoints

### Autenticacao
- `POST /api/v1/sign_in` — login
- `DELETE /api/v1/sign_out` — logout
- `GET /api/v1/is_signed_in` — verifica sessao
- `POST /api/v1/users` — cadastro

### Estabelecimentos
- `GET /api/v1/establishments/:code` — detalhes
- `POST /api/v1/establishments` — criar
- `PATCH /api/v1/establishments/:code` — atualizar

### Pratos e Bebidas
- `GET /api/v1/establishments/:code/dishes` — listar pratos
- `POST /api/v1/establishments/:code/dishes` — criar prato
- `GET /api/v1/establishments/:code/drinks` — listar bebidas
- `POST /api/v1/establishments/:code/drinks` — criar bebida
- `GET/POST /api/v1/establishments/:code/dishes/:id/portions` — porcoes

### Cardapios
- `GET /api/v1/establishments/:code/menus` — listar
- `POST /api/v1/establishments/:code/menus` — criar
- `GET/POST /api/v1/establishments/:code/menus/:id/menu_items` — itens do cardapio

### Pedidos
- `GET /api/v1/establishments/:code/orders` — listar
- `POST /api/v1/establishments/:code/orders` — criar
- `POST /api/v1/establishments/:code/orders/:code/items` — adicionar item
- `DELETE /api/v1/establishments/:code/orders/:code/items/:id` — remover item
- `PATCH /api/v1/establishments/:code/orders/:code/confirm` — confirmar
- `PATCH /api/v1/establishments/:code/orders/:code/prepare_order` — preparando
- `PATCH /api/v1/establishments/:code/orders/:code/ready_order` — pronto
- `PATCH /api/v1/establishments/:code/orders/:code/deliver` — entregue
- `PATCH /api/v1/establishments/:code/orders/:code/cancelled` — cancelar
- `GET /api/v1/orders/history` — historico

### Tags e horarios
- `GET/POST /api/v1/establishments/:code/tags` — tags
- `GET /api/v1/establishments/:code/working_hours` — horarios
- `PATCH /api/v1/establishments/:code/working_hours/:id` — atualizar horario

### Avaliacoes
- `GET /api/v1/establishments/:code/ratings` — avaliacoes do estabelecimento

## Testes

**Backend (RSpec)**
```bash
cd backend
bundle exec rspec
```
159 exemplos, 0 falhas.

**Frontend (Vitest)**
```bash
cd frontend
npm test
```

## Variaveis de ambiente

### Backend
- `RAILS_ENV` — ambiente Rails
- `RAILS_MASTER_KEY` — chave mestra para credenciais

### Frontend
- `VITE_API_URL` — URL base da API (padrao: `/api/v1`)

## Autora

Lais Rodrigues — [GitHub](https://github.com/laisrod)

Projeto desenvolvido como parte do programa IT Academy.
