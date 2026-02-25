# PaLeva 🍽️

A comprehensive restaurant management system built with Ruby on Rails and React.

## 📋 About

PaLeva is a full-stack application for managing restaurants, menus, orders, and customer interactions. The system provides separate interfaces for restaurant owners and customers, enabling complete control over the business operations.

## 📈 Metrics and Impact

### Measured metrics (current repository state)
- **17 domain entities** managed in the backend (`ApplicationRecord` models).
- **87 API v1 routes** available for app features and integrations.
- **Backend test suite:** 130 RSpec examples total, with 44 currently passing.
- **Critical OAuth request tests:** 17 examples, with 12 currently passing.
- **Frontend test suite:** 36 tests total, with 30 currently passing.

### Estimated impact metrics
- **Setup time reduction: ~80% (estimated)** when using the current scripted/containerized setup compared to a fully manual setup.
- **High coverage of critical authentication scenarios (estimated)** based on dedicated OAuth success/failure request specs and frontend callback flow tests.

## 🚀 Features

### For Restaurant Owners
- **Dashboard** - Overview of orders, statistics, and business metrics
- **Menu Management** - Create and manage dishes, drinks, and menus
- **Order Management** - Real-time order tracking and status updates
- **Establishment Management** - Configure restaurant details and working hours
- **Tags & Categories** - Organize items with custom tags
- **Ratings & Reviews** - View and manage customer feedback

### For Customers
- **Restaurant Discovery** - Browse available restaurants
- **Menu Browsing** - View menus with categories and filters
- **Order Placement** - Place orders for delivery or pickup
- **Order History** - Track past orders
- **Real-time Updates** - Receive live order status notifications

## 🛠️ Tech Stack

### Backend
- **Ruby 3.3.4**
- **Rails 7.2.2.1**
- **SQLite3** (development)
- **Action Cable** (WebSockets for real-time features)
- **Devise** (authentication)
- **Vite** (asset pipeline)

### Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **React Router DOM**
- **Bootstrap 5**
- **WebSocket** (real-time notifications)

## 📦 Project Structure

```
PaLeva/
├── backend/          # Rails API
│   ├── app/
│   │   ├── controllers/  # API controllers
│   │   ├── models/       # ActiveRecord models
│   │   ├── channels/     # Action Cable channels
│   │   └── views/        # Rails views (legacy)
│   ├── config/       # Rails configuration
│   ├── db/           # Database migrations and seeds
│   └── Dockerfile     # Backend container definition
│
├── frontend/         # React application
│   ├── src/
│   │   ├── client/       # Customer-facing features
│   │   ├── owner/        # Owner-facing features
│   │   ├── shared/       # Shared components and utilities
│   │   └── components/   # Global components
│   └── Dockerfile     # Frontend container definition
│
└── docker-compose.yml # Docker orchestration
```

## 🚀 Quick Start

### Prerequisites

- **Docker** and **Docker Compose** installed
- Git

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone git@github.com:laisrod/PaLeva.git
   cd PaLeva
   ```

2. **Start the application**
   ```bash
   docker-compose up
   ```

3. **Run database migrations** (in a new terminal)
   ```bash
   docker-compose exec backend bin/rails db:migrate
   ```

4. **Seed the database** (optional)
   ```bash
   docker-compose exec backend bin/rails db:seed
   ```

5. **Access the application**
   - Frontend: http://localhost:5176
   - Backend API: http://localhost:3000

### Without Docker

#### Backend Setup

```bash
cd backend
bundle install
bin/rails db:create db:migrate db:seed
bin/rails server
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Default Credentials

After running `rails db:seed`:

### Owner Account
- **Email:** owner@example.com
- **Password:** testes123456

### Customer Account
- **Email:** client@example.com
- **Password:** testes123456

## 📡 API Endpoints

### Authentication
- `POST /api/v1/sign_in` - User login
- `DELETE /api/v1/sign_out` - User logout
- `GET /api/v1/is_signed_in` - Check authentication status
- `POST /api/v1/users` - User registration

### Establishments
- `GET /api/v1/establishments/:code` - Get establishment details
- `POST /api/v1/establishments` - Create establishment
- `PUT /api/v1/establishments/:code` - Update establishment

### Dishes & Drinks
- `GET /api/v1/establishments/:code/dishes` - List dishes
- `POST /api/v1/establishments/:code/dishes` - Create dish
- `GET /api/v1/establishments/:code/drinks` - List drinks
- `POST /api/v1/establishments/:code/drinks` - Create drink

### Menus
- `GET /api/v1/establishments/:code/menus` - List menus
- `POST /api/v1/establishments/:code/menus` - Create menu

### Orders
- `GET /api/v1/establishments/:code/orders` - List orders
- `POST /api/v1/establishments/:code/orders` - Create order
- `PATCH /api/v1/orders/:code/confirm` - Confirm order
- `PATCH /api/v1/orders/:code/prepare_order` - Mark as preparing
- `PATCH /api/v1/orders/:code/ready_order` - Mark as ready
- `PATCH /api/v1/orders/:code/deliver` - Mark as delivered

### Working Hours
- `GET /api/v1/establishments/:code/working_hours` - Get working hours
- `PUT /api/v1/establishments/:code/working_hours` - Update working hours

## 🐳 Docker Commands

### Start services
```bash
docker-compose up
```

### Start in background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Execute commands in containers
```bash
# Rails console
docker-compose exec backend bin/rails console

# Run migrations
docker-compose exec backend bin/rails db:migrate

# Install frontend dependencies
docker-compose exec frontend npm install
```

### Rebuild containers
```bash
docker-compose build --no-cache
docker-compose up
```

## 🧪 Testing

### Backend (RSpec)
```bash
cd backend
bundle exec rspec
```

### Frontend (Vitest)
```bash
cd frontend
npm test
```

## 📝 Environment Variables

### Backend
- `RAILS_ENV` - Rails environment (development/production)
- `RAILS_MASTER_KEY` - Rails master key for encrypted credentials

### Frontend
- `VITE_API_URL` - API base URL (default: `/api/v1`)
- `VITE_DOCKER` - Set to `true` when running in Docker

## 🔧 Development

### Code Style

- **Backend:** Follow Ruby style guide and use RuboCop
- **Frontend:** Use ESLint and Prettier configurations

### Git Workflow

- Create feature branches from `main`
- Use conventional commit messages
- Open pull requests for review

## 📚 Documentation

- [Docker Setup](DOCKER.md) - Detailed Docker configuration guide
- [Backend README](backend/README.md) - Backend-specific documentation
- [Frontend README](frontend/README.md) - Frontend-specific documentation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of an educational program.

## 👥 Authors

- **Lais Rodrigues** - [GitHub](https://github.com/laisrod)

## 🙏 Acknowledgments

- Built as part of the IT Academy program
- Uses modern web development best practices
- Inspired by real-world restaurant management needs

---

**Note:** This is a development project. For production use, additional security measures, database migration to PostgreSQL/MySQL, and proper deployment configuration are recommended.
