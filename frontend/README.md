# PaLeva Frontend

Frontend React para o sistema PaLeva de gerenciamento de restaurantes.

## Tecnologias

- React 18
- TypeScript
- Vite
- React Router DOM
- CSS Modules

## Como Rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5176`

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa o linter

## Estrutura

```
src/
├── assets/           # Ícones SVG (restaurant, dish, drink, orders, menu, clock, user, logout)
├── client/           # Área do cliente
│   ├── components/   # BottomNavigation, CartSidebar, MenuCategories, ProductCard
│   ├── hooks/        # useCart, useMenu, useRestaurants
│   └── pages/        # Menu, RestaurantsList
├── components/       # AppRoutes, ProtectedRoute
├── css/
│   ├── client/       # Estilos da área do cliente
│   ├── owner/        # Estilos da área do proprietário
│   └── shared/       # Variáveis CSS e estilos compartilhados
├── owner/            # Área do proprietário
│   ├── components/   # Componentes organizados por domínio
│   │   ├── Dashboard/
│   │   ├── Dish/
│   │   ├── DishPortion/
│   │   ├── Drink/
│   │   ├── DrinkPortion/
│   │   ├── Establishment/
│   │   ├── Layout/
│   │   ├── Menu/
│   │   ├── Orders/
│   │   ├── Tags/
│   │   └── WorkingHours/
│   ├── hooks/        # Hooks customizados por domínio
│   ├── services/     # Serviços de API
│   └── types/        # Tipos TypeScript
└── shared/           # Código compartilhado
    ├── hooks/        # useAuth
    ├── pages/        # Login, Register
    ├── services/     # API compartilhada
    └── utils/        # Utilitários (auth)
```

## Tema

O sistema usa variáveis CSS para theming (ver `src/css/shared/variables.css`):

```css
--color-primary: #FF7F3F;     /* Laranja */
--color-bg-primary: #252836;   /* Fundo escuro */
--color-bg-secondary: #1F1D2B; /* Cards */
--text-primary: #FFFFFF;       /* Texto principal */
```

## Rotas Principais

### Públicas
- `/login` - Login
- `/register` - Cadastro

### Proprietário
- `/establishment/:code` - Dashboard
- `/establishment/:code/dishes` - Pratos
- `/establishment/:code/drinks` - Bebidas
- `/establishment/:code/menus` - Cardápios
- `/establishment/:code/orders` - Pedidos
- `/establishment/:code/tags` - Características
- `/establishment/:code/working-hours` - Horários

### Cliente
- `/restaurants` - Lista de restaurantes
- `/menu/:code` - Menu do restaurante
