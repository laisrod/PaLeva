import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DrinksEmpty from './DrinksEmpty'

describe('DrinksEmpty', () => {
  it('renders empty message and first-create action for owner', () => {
    render(
      <MemoryRouter>
        <DrinksEmpty establishmentCode="est-1" isOwner />
      </MemoryRouter>
    )

    expect(screen.getByText('Nenhuma bebida cadastrada')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Criar Primeira Bebida' })).toHaveAttribute(
      'href',
      '/establishment/est-1/drinks/new'
    )
  })
})
