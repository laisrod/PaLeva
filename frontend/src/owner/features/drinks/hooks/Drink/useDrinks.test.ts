import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useDrinks } from './useDrinks'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getTags: vi.fn(),
    getDrinks: vi.fn(),
  },
}))

describe('useDrinks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads tags and drinks on mount and exposes filtered result by search term', async () => {
    // Arrange
    vi.mocked(ownerApi.getTags).mockResolvedValue({ data: [{ id: 1, name: 'Gelada' }] } as any)
    vi.mocked(ownerApi.getDrinks).mockResolvedValue({
      data: [
        { id: 10, name: 'Suco de Laranja' },
        { id: 11, name: 'Refrigerante' },
      ],
    } as any)

    // Act
    const { result } = renderHook(() => useDrinks('est-1'))
    await waitFor(() => {
      expect(result.current.drinks.length).toBe(2)
    })
    act(() => {
      result.current.setSearchTerm('suco')
    })

    // Assert
    expect(ownerApi.getTags).toHaveBeenCalledWith('est-1', 'drink')
    expect(ownerApi.getDrinks).toHaveBeenCalledWith('est-1', undefined)
    expect(result.current.drinks).toEqual([{ id: 10, name: 'Suco de Laranja' }])
  })

  it('toggles selected tags and refetches drinks with tag filters', async () => {
    // Arrange
    vi.mocked(ownerApi.getTags).mockResolvedValue({ data: [] } as any)
    vi.mocked(ownerApi.getDrinks).mockResolvedValue({ data: [] } as any)
    const { result } = renderHook(() => useDrinks('est-1'))

    // Act
    await waitFor(() => {
      expect(ownerApi.getDrinks).toHaveBeenCalledWith('est-1', undefined)
    })
    act(() => {
      result.current.toggleTag(9)
    })

    // Assert
    await waitFor(() => {
      expect(ownerApi.getDrinks).toHaveBeenCalledWith('est-1', [9])
    })
    expect(result.current.selectedTags).toEqual([9])
  })
})
