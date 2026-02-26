import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DrinksHeader from './DrinksHeader'

describe('DrinksHeader', () => {
  it('shows create drink action when user is owner', () => {
    render(
      <MemoryRouter>
        <DrinksHeader establishmentCode="est-1" isOwner />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: 'Novo Bebida' })
    expect(link).toHaveAttribute('href', '/establishment/est-1/drinks/new')
  })
})
