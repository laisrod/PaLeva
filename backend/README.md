# PaLeva — Backend

API Rails para o sistema PaLeva de gestao de restaurantes.

## Stack

- Ruby 3.3.4
- Rails 7.2
- SQLite3 (desenvolvimento e testes) / PostgreSQL (producao)
- Devise (autenticacao por sessao)
- Action Cable (WebSockets para pedidos em tempo real)
- RSpec (testes)
- Active Storage (upload de fotos de pratos e bebidas)

## Como rodar

```bash
bundle install
bin/rails db:create db:migrate db:seed
bin/rails server
```

Servidor disponivel em `http://localhost:3000`.

## Testes

```bash
bundle exec rspec
```

159 exemplos, 0 falhas. Cobertura inclui models, requests e services.

## Estrutura relevante

```
app/
├── controllers/api/v1/   # Todos os endpoints da API
├── models/               # 19 modelos ActiveRecord
├── services/             # Service objects
│   ├── order_item_service.rb     # Adiciona/remove itens de pedidos
│   └── order_status_service.rb  # Gerencia transicoes de status
├── channels/             # Action Cable (OrderChannel)
├── serializers/          # Respostas JSON formatadas
└── jobs/                 # ApplicationJob (base para jobs futuros)
```

## Modelos

| Modelo | Descricao |
|---|---|
| User | Usuarios (proprietario ou funcionario) |
| Establishment | Estabelecimento vinculado ao usuario |
| Dish | Prato cadastrado pelo estabelecimento |
| Drink | Bebida cadastrada pelo estabelecimento |
| Portion | Porcao com preco (compartilhada entre pratos e bebidas) |
| Tag | Caracteristica/categoria (dish ou drink) |
| DishTag | Associacao prato-tag |
| DrinkTag | Associacao bebida-tag |
| Menu | Cardapio do estabelecimento |
| MenuItem | Item de cardapio (prato ou bebida vinculado a um menu) |
| MenuItemPortion | Porcoes disponiveis para um item de cardapio |
| Order | Pedido realizado por um cliente |
| OrderMenuItem | Item dentro de um pedido (porcao + quantidade) |
| PriceHistory | Historico de precos de uma porcao |
| Rating | Avaliacao de um prato ou bebida |
| Review | Review textual vinculada a um pedido |
| WorkingHour | Horarios de funcionamento por dia da semana |
| EmployeeInvitation | Convite para funcionario |

## Service objects

### OrderItemService
Gerencia adicao e remocao de itens em pedidos com pessimistic locking.
Previne race conditions no calculo do total ao usar `with_lock`.

```ruby
service = OrderItemService.new(order)
service.add_item(portion_id: 1, menu_item_id: 2, quantity: 1)
service.remove_item(item_id: 5)
```

### OrderStatusService
Gerencia transicoes de status com pessimistic locking.

```ruby
service = OrderStatusService.new(order)
service.progress!   # avanca para o proximo status
service.cancel!     # cancela o pedido
```

Ambos retornam `{ success: true/false, message: '...' }` e tratam `ActiveRecord::LockWaitTimeout` retornando HTTP 409.

## Autenticacao

Baseada em sessao via Devise. Endpoints:

- `POST /api/v1/sign_in`
- `DELETE /api/v1/sign_out`
- `GET /api/v1/is_signed_in`
- `POST /api/v1/users` — cadastro

## Credenciais de teste

Apos `bin/rails db:seed`:

| Perfil | Email | Senha |
|---|---|---|
| Proprietario | owner@example.com | testes123456 |
| Cliente | client@example.com | testes123456 |
