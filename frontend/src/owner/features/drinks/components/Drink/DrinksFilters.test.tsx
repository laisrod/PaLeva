import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DrinksFilters from './DrinksFilters'

describe('DrinksFilters', () => {
  it('updates search and toggles selected tag', () => {
    const onSearchChange = vi.fn()
    const onToggleTag = vi.fn()

    render(
      <DrinksFilters
        tags={[
          { id: 1, name: 'Gelado' },
          { id: 2, name: 'Sem alcool' },
        ]}
        selectedTags={[2]}
        onToggleTag={onToggleTag}
        searchTerm=""
        onSearchChange={onSearchChange}
      />
    )

    fireEvent.change(screen.getByPlaceholderText('Buscar bebida por nome...'), {
      target: { value: 'suco' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Sem alcool' }))

    expect(onSearchChange).toHaveBeenCalledWith('suco')
    expect(onToggleTag).toHaveBeenCalledWith(2)
  })
})
