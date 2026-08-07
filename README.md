# PaLeva

Full restaurant management system with separate interfaces for owners and customers.

## About

PaLeva is a full-stack application for managing restaurants, menus, orders and reviews. Owners get access to a complete control panel, while customers can browse the menu and place orders in real time.

## Features

### For owners
- Dashboard with an overview of orders and metrics
- Management of dishes, drinks and desserts
- Menu and menu item management
- Order control with real-time status updates
- Establishment settings and working hours
- Custom tags and categories
- Customer ratings and reviews
- Background job monitoring via a Sidekiq dashboard (queue stats)

### For customers
- Listing of available restaurants
- Menu browsing with categories and filters
- Placing orders
- Order history
- Real-time order status notifications
- Google OAuth login

## Stack

### Backend
- Ruby 3.3.4
- Rails 7.2
- SQLite3 (development) / PostgreSQL (production)
- Action Cable (WebSockets for real-time updates)
- Devise (authentication) + JWT
- Sidekiq + Redis (background jobs)
- Active Model Serializers (JSON API responses)
- Active Storage Validations (file uploads)
- `cpf_cnpj` (Brazilian document validation)
- RSpec, Capybara, Selenium (tests)
- Brakeman (security static analysis), RuboCop (linting)

### Frontend
- React 19
- TypeScript
- Vite 7
- React Router DOM 7
- Tailwind CSS v4
- Recharts (charts/dashboards)
- Vitest, Testing Library (tests)
- ESLint

### Infrastructure
- Docker & Docker Compose (separate services for backend and frontend)
- Vercel (deployment)
- GitHub Actions (CI)

## Project structure

```
PaLeva/
├── backend/
│   ├── app/
│   │   ├── controllers/api/v1/   # API controllers
│   │   ├── models/               # ActiveRecord models
│   │   ├── services/             # Service objects
│   │   ├── channels/             # Action Cable
│   │   └── serializers/          # Response serializers
│   ├── spec/                     # RSpec tests
│   └── db/                       # Migrations and seeds
│
└── frontend/
    └── src/
        ├── client/               # Customer area
        ├── owner/                # Owner area
        │   └── features/         # Organized by domain
        └── shared/               # Shared code
```

## Running the project

### Without Docker

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

Access the frontend at `http://localhost:5176` and the backend at `http://localhost:3000`.

### With Docker

```bash
docker-compose up
docker-compose exec backend bin/rails db:migrate
```

## Test credentials

After running `rails db:seed`:

| Role | Email | Password |
|---|---|---|
| Owner | owner@example.com | testes123456 |
| Customer | client@example.com | testes123456 |

## API — main endpoints

### Authentication
- `POST /api/v1/sign_in` — login
- `DELETE /api/v1/sign_out` — logout
- `GET /api/v1/is_signed_in` — check session
- `POST /api/v1/users` — sign up
- `GET /api/v1/login/google` — start Google OAuth
- `GET|POST /api/v1/login/:provider/callback` — OAuth callback

### Establishments
- `GET /api/v1/establishments/:code` — details
- `POST /api/v1/establishments` — create
- `PATCH /api/v1/establishments/:code` — update
- `GET /api/v1/establishments/:code/menu` — public menu (all dishes and drinks)
- `GET /api/v1/establishments/:code/dashboard/stats` — dashboard stats

### Dishes and drinks
- `GET /api/v1/establishments/:code/dishes` — list dishes
- `POST /api/v1/establishments/:code/dishes` — create dish
- `GET /api/v1/establishments/:code/drinks` — list drinks
- `POST /api/v1/establishments/:code/drinks` — create drink
- `GET/POST /api/v1/establishments/:code/dishes/:id/portions` — portions
- `GET/POST /api/v1/establishments/:code/dishes/:id/ratings` — dish ratings
- `GET/POST /api/v1/establishments/:code/drinks/:id/ratings` — drink ratings

### Menus
- `GET /api/v1/establishments/:code/menus` — list
- `POST /api/v1/establishments/:code/menus` — create
- `GET/POST /api/v1/establishments/:code/menus/:id/menu_items` — menu items

### Orders
- `GET /api/v1/establishments/:code/orders` — list
- `POST /api/v1/establishments/:code/orders` — create
- `POST /api/v1/establishments/:code/orders/:code/items` — add item
- `DELETE /api/v1/establishments/:code/orders/:code/items/:id` — remove item
- `PATCH /api/v1/establishments/:code/orders/:code/confirm` — confirm
- `PATCH /api/v1/establishments/:code/orders/:code/prepare_order` — preparing
- `PATCH /api/v1/establishments/:code/orders/:code/ready_order` — ready
- `PATCH /api/v1/establishments/:code/orders/:code/deliver` — delivered
- `PATCH /api/v1/establishments/:code/orders/:code/cancelled` — cancel
- `GET/POST /api/v1/establishments/:code/orders/:code/reviews` — order reviews
- `GET /api/v1/orders/history` — customer order history

### Tags and working hours
- `GET/POST /api/v1/establishments/:code/tags` — tags
- `GET /api/v1/establishments/:code/working_hours` — working hours
- `PATCH /api/v1/establishments/:code/working_hours/:id` — update working hours

### Ratings and reviews
- `GET /api/v1/establishments/:code/ratings` — establishment ratings
- `GET /api/v1/ratings/:id` — rating details
- `GET /api/v1/reviews/:id` — review details

### Background jobs
- `GET /api/v1/sidekiq/stats` — Sidekiq queue stats (used by the owner dashboard)
- `/sidekiq` — Sidekiq Web UI (mounted engine)

## Tests

**Backend (RSpec)**
```bash
cd backend
bundle exec rspec
```
173 examples, 0 failures.

**Frontend (Vitest)**
```bash
cd frontend
npm test
```

## Environment variables

### Backend
- `RAILS_ENV` — Rails environment
- `RAILS_MASTER_KEY` — master key for credentials

### Frontend
- `VITE_API_URL` — API base URL (default: `/api/v1`)

## Author

Lais Rodrigues — [GitHub](https://github.com/laisrod)

Project developed as part of the IT Academy program.
