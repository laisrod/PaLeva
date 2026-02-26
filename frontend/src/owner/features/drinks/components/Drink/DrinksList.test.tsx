import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DrinksList from './DrinksList'

vi.mock('./DrinkCard', () => ({
  default: ({ drink }: any) => <div data-testid="drink-card">{drink.name}</div>,
}))

describe('DrinksList', () => {
  it('renders one card for each drink', () => {
    render(
      <DrinksList
        drinks={[
          { id: 1, name: 'Suco de laranja' } as any,
          { id: 2, name: 'Refrigerante' } as any,
        ]}
        establishmentCode="est-1"
        isOwner
      />
    )

    expect(screen.getAllByTestId('drink-card')).toHaveLength(2)
    expect(screen.getByText('Suco de laranja')).toBeInTheDocument()
    expect(screen.getByText('Refrigerante')).toBeInTheDocument()
  })
})
