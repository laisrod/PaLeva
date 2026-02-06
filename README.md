# Guia de Testes

Este projeto usa **Vitest** + **React Testing Library** para testes.

## Scripts Disponíveis

```bash
# Executar testes em modo watch (recomendado durante desenvolvimento)
npm test

# Executar testes uma vez
npm run test:run

# Executar testes com UI interativa
npm run test:ui

# Executar testes com cobertura
npm run test:coverage
```

## Estrutura de Testes (Feature-Based)

**Recomendação: Coloque os testes junto ao código que eles testam (co-location)**

```
src/
├── owner/features/dishes/
│   ├── components/Dish/Dishes.tsx
│   ├── components/Dish/Dishes.test.tsx      ← Teste do componente
│   ├── hooks/Dish/useDishes.ts
│   ├── hooks/Dish/useDishes.test.ts         ← Teste do hook
│   └── services/dishes.ts
│   └── services/dishes.test.ts              ← Teste do service
└── test/
    ├── setup.ts                              ← Configuração global
    ├── utils/                                ← Helpers compartilhados
    └── mocks/                                ← Mocks compartilhados
```

**Ver `ARCHITECTURE.md` para detalhes completos da arquitetura de testes.**

## Exemplo de Teste

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## Boas Práticas

1. **Teste comportamento, não implementação**
2. **Use queries acessíveis**: `getByRole`, `getByLabelText`, `getByText`
3. **Evite detalhes de implementação**: não teste estados internos
4. **Teste integração**: teste como o usuário interage com o componente
5. **Use `userEvent`** para simular interações do usuário

## Recursos

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)
