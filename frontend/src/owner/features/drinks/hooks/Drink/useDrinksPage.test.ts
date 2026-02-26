import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDrinksPage } from './useDrinksPage'
import { useDrinks } from './useDrinks'
import { useDeleteDrink } from './useDeleteDrink'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'
import { useAuth } from '../../../../../shared/hooks/useAuth'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useDrinks', () => ({
  useDrinks: vi.fn(),
}))

vi.mock('./useDeleteDrink', () => ({
  useDeleteDrink: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('useDrinksPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1' } as any)
    vi.mocked(useAuth).mockReturnValue({ isOwner: true } as any)
  })

  it('composes listing/deleting hooks and exposes page state', () => {
    // Arrange
    const toggleTag = vi.fn()
    const setSearchTerm = vi.fn()
    const refetch = vi.fn()
    const deleteDrink = vi.fn()

    vi.mocked(useDrinks).mockReturnValue({
      drinks: [{ id: 1, name: 'Suco' }],
      tags: ['gelado'],
      selectedTags: ['gelado'],
      loading: false,
      error: null,
      toggleTag,
      searchTerm: 'suco',
      setSearchTerm,
      refetch,
    } as any)

    vi.mocked(useDeleteDrink).mockReturnValue({
      deleteDrink,
      loading: false,
    } as any)

    // Act
    const { result } = renderHook(() => useDrinksPage())

    // Assert
    expect(useRequireOwner).toHaveBeenCalled()
    expect(useDrinks).toHaveBeenCalledWith('est-1')
    expect(useDeleteDrink).toHaveBeenCalled()
    expect(result.current.isOwner).toBe(true)
    expect(result.current.drinks).toEqual([{ id: 1, name: 'Suco' }])
    expect(result.current.deleteDrink).toBe(deleteDrink)
    expect(result.current.searchTerm).toBe('suco')
  })
})
