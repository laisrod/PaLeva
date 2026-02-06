# Client Architecture

## Estrutura de Pastas (Feature-Based)

```
client/
├── features/        # Features organizadas por domínio
│   ├── menu/       # Feature: Menu e Produtos
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── cart/       # Feature: Carrinho
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── types/
│   │   └── utils/
│   ├── restaurants/ # Feature: Restaurantes
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── orders/     # Feature: Pedidos/Histórico
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── utils/
└── shared/          # Recursos compartilhados entre features
    ├── components/  # Componentes compartilhados (Navigation, BottomNavigation)
    ├── constants/   # Constantes globais
    ├── hooks/       # Hooks compartilhados
    ├── layouts/    # Layouts compartilhados
    └── types/       # Tipos compartilhados
```

## Melhorias Implementadas

### 1. **Feature-Based Organization** (`features/`)
- Organização por domínio de negócio
- Cada feature contém seus próprios componentes, hooks, services, types e utils
- Facilita manutenção e escalabilidade
- Features: `menu/`, `cart/`, `restaurants/`, `orders/`

### 2. **Services Layer** (dentro de cada feature)
- Separação de lógica de API por feature
- `menu/services/menuService.ts` - Operações relacionadas ao menu
- `orders/services/orderService.ts` - Operações relacionadas a pedidos
- `restaurants/services/restaurantService.ts` - Operações relacionadas a restaurantes

### 3. **Constants** (`shared/constants/`)
- Centralização de valores fixos compartilhados
- `appConstants.ts` - Horários, telefones, configurações

### 4. **Contexts** (`features/cart/contexts/`)
- Estado global compartilhado
- `CartContext.tsx` - Gerenciamento de carrinho global

### 5. **Layouts** (`shared/layouts/`)
- Componentes de layout reutilizáveis
- `ClientLayout.tsx` - Layout padrão do client

## Uso

### CartContext
```tsx
import { CartProvider } from './features/cart/contexts/CartContext'
import { useCart } from './features/cart/contexts/CartContext'

// No App.tsx ou componente pai
<CartProvider>
  <YourApp />
</CartProvider>

// Em qualquer componente filho
const { cart, addToCart, removeFromCart } = useCart()
```

### Services (por feature)
```tsx
// Menu feature
import { getPublicMenu } from './features/menu/services/menuService'

// Orders feature
import { createPublicOrder } from './features/orders/services/orderService'

// Restaurants feature
import { getRestaurants } from './features/restaurants/services/restaurantService'
```

### Constants (shared)
```tsx
import { APP_CONFIG } from './shared/constants/appConstants'

const deliveryFee = APP_CONFIG.DELIVERY.FEE
const orderHours = APP_CONFIG.ORDER_HOURS.DISPLAY
```

### Pages (por feature)
```tsx
// Menu page
import Menu from './features/menu/pages/Menu'

// Restaurants page
import RestaurantsList from './features/restaurants/pages/RestaurantsList'

// Orders page
import OrderHistory from './features/orders/pages/OrderHistory'
```

## Benefícios da Organização por Features

1. **Manutenibilidade** - Fácil localizar código relacionado a uma feature específica
2. **Escalabilidade** - Adicionar novas features sem afetar as existentes
3. **Colaboração** - Diferentes desenvolvedores podem trabalhar em features diferentes
4. **Testabilidade** - Testes podem ser organizados por feature
5. **Reutilização** - Componentes compartilhados ficam em `shared/`

## Próximas Melhorias Sugeridas

1. **Error boundaries** - Adicionar tratamento de erros global por feature
2. **Loading states** - Componente de loading reutilizável em `shared/`
3. **Form validation** - Biblioteca de validação centralizada
4. **State management** - Considerar Zustand ou Redux para estado complexo
5. **Barrel exports** - Criar `index.ts` em cada feature para facilitar imports
