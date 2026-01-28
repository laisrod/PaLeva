# PaLeva Backend

API Rails para o sistema PaLeva de gerenciamento de restaurantes.

## Tecnologias

- Ruby 3.x
- Rails 7
- PostgreSQL
- Devise (autenticação)
- RSpec (testes)

## Como Rodar

```bash
bundle install
rails db:create db:migrate db:seed
rails server
```

Acesse `http://localhost:3000`

## Scripts

- `rails server` - Inicia o servidor
- `rspec` - Executa os testes
- `rails db:seed` - Popula o banco com dados de teste

## API Endpoints

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Cadastro
- `DELETE /api/v1/auth/logout` - Logout

### Estabelecimentos
- `GET /api/v1/establishments/:code` - Detalhes do estabelecimento
- `POST /api/v1/establishments` - Criar estabelecimento
- `PUT /api/v1/establishments/:code` - Atualizar estabelecimento

### Pratos
- `GET /api/v1/establishments/:code/dishes` - Listar pratos
- `POST /api/v1/establishments/:code/dishes` - Criar prato
- `PUT /api/v1/dishes/:id` - Atualizar prato
- `DELETE /api/v1/dishes/:id` - Remover prato

### Bebidas
- `GET /api/v1/establishments/:code/drinks` - Listar bebidas
- `POST /api/v1/establishments/:code/drinks` - Criar bebida
- `PUT /api/v1/drinks/:id` - Atualizar bebida
- `DELETE /api/v1/drinks/:id` - Remover bebida

### Cardápios
- `GET /api/v1/establishments/:code/menus` - Listar cardápios
- `POST /api/v1/establishments/:code/menus` - Criar cardápio
- `PUT /api/v1/menus/:id` - Atualizar cardápio
- `DELETE /api/v1/menus/:id` - Remover cardápio

### Pedidos
- `GET /api/v1/establishments/:code/orders` - Listar pedidos
- `POST /api/v1/establishments/:code/orders` - Criar pedido
- `PUT /api/v1/orders/:id` - Atualizar pedido

### Tags
- `GET /api/v1/establishments/:code/tags` - Listar tags (filtro por categoria: dish/drink)
- `POST /api/v1/establishments/:code/tags` - Criar tag
- `PUT /api/v1/tags/:id` - Atualizar tag
- `DELETE /api/v1/tags/:id` - Remover tag

### Horários de Funcionamento
- `GET /api/v1/establishments/:code/working_hours` - Listar horários
- `PUT /api/v1/establishments/:code/working_hours` - Atualizar horários

## Modelos Principais

- **User** - Usuários (owner/employee)
- **Establishment** - Estabelecimentos
- **Dish** - Pratos
- **Drink** - Bebidas
- **DishPortion/DrinkPortion** - Porções com preços
- **Menu** - Cardápios
- **MenuItem** - Itens do cardápio
- **Order** - Pedidos
- **OrderItem** - Itens do pedido
- **Tag** - Características (categoria: dish/drink)
- **WorkingHour** - Horários de funcionamento

## Credenciais de Teste

Após rodar `rails db:seed`:
- **Email**: owner@example.com
- **Senha**: 123456

## Documentação Adicional

- [Arquitetura](ARCHITECTURE.md)
- [Refatorações](REFACTORING.md)
- [Guia React](REACT_GUIDE.md)
