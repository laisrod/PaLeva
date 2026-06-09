# PaLeva — Frontend

Interface React para o sistema PaLeva de gestao de restaurantes.

## Stack

- React 19
- TypeScript 5.7
- Vite 7
- React Router DOM 7
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Vitest (testes)

## Como rodar

```bash
npm install
npm run dev
```

Disponivel em `http://localhost:5176`.

## Scripts

| Comando | Descricao |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run preview` | Visualiza o build |
| `npm test` | Roda os testes |
| `npm run lint` | Executa o linter |

## Estrutura

```
src/
├── assets/               # Icones SVG (restaurant, dish, drink, orders, menu, clock, user, logout)
├── components/           # AppRoutes, ProtectedRoute
├── css/
│   ├── shared/           # variables.css, index.css (design tokens e Tailwind)
│   ├── owner/            # Estilos da area do proprietario
│   └── client/           # Estilos da area do cliente
├── owner/
│   ├── features/         # Organizacao por dominio
│   │   ├── dashboard/
│   │   ├── dishes/       # Pratos e sobremesas
│   │   ├── drinks/
│   │   ├── establishments/
│   │   ├── menus/
│   │   ├── orders/
│   │   ├── ratings/
│   │   ├── tags/
│   │   └── working-hours/
│   └── shared/
│       ├── components/Layout/
│       └── hooks/
├── client/
│   └── features/
│       ├── cart/
│       ├── menu/
│       ├── orders/
│       └── restaurants/
└── shared/
    ├── hooks/             # useAuth, useApiData, useInfiniteScroll
    └── services/          # api.ts (cliente HTTP centralizado)
```

## Tema

Paleta earthy definida em `src/css/shared/variables.css`:

```css
--color-primary: #E8850A;
--color-bg-primary: #F5F4F2;
--text-primary: #331A00;
--text-secondary: #766554;
```

## Rotas

### Publicas
- `/login`
- `/register`
- `/restaurants`
- `/menu/:code`

### Proprietario
- `/establishment/:code` — dashboard
- `/establishment/:code/dishes` — pratos
- `/establishment/:code/drinks` — bebidas
- `/establishment/:code/desserts` — sobremesas
- `/establishment/:code/menus` — cardapios
- `/establishment/:code/orders` — pedidos
- `/establishment/:code/tags` — caracteristicas
- `/establishment/:code/working-hours` — horarios
- `/establishment/:code/ratings` — avaliacoes
- `/establishment/:code/edit` — editar estabelecimento

### Cliente
- `/orders/history` — historico de pedidos

## Variaveis de ambiente

- `VITE_API_URL` — URL base da API (padrao: `/api/v1`)
