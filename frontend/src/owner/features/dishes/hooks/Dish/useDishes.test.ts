import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useDishes } from './useDishes'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getTags: vi.fn(),
    getDishes: vi.fn(),
  },
}))

describe('useDishes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads tags and dishes on mount and filters dishes by search term', async () => {
    // Arrange
    vi.mocked(ownerApi.getTags).mockResolvedValue({ data: [{ id: 1, name: 'Vegano' }] } as any)
    vi.mocked(ownerApi.getDishes).mockResolvedValue({
      data: [
        { id: 10, name: 'Feijoada' },
        { id: 11, name: 'Salada' },
      ],
    } as any)

    // Act
    const { result } = renderHook(() => useDishes('est-1'))
    await waitFor(() => {
      expect(result.current.dishes.length).toBe(2)
    })
    act(() => {
      result.current.setSearchTerm('fei')
    })

    // Assert
    expect(ownerApi.getTags).toHaveBeenCalledWith('est-1', 'dish')
    expect(ownerApi.getDishes).toHaveBeenCalledWith('est-1', undefined)
    expect(result.current.dishes).toEqual([{ id: 10, name: 'Feijoada' }])
  })

  it('toggles selected tags and refetches dishes with tag filters', async () => {
    // Arrange
    vi.mocked(ownerApi.getTags).mockResolvedValue({ data: [] } as any)
    vi.mocked(ownerApi.getDishes).mockResolvedValue({ data: [] } as any)
    const { result } = renderHook(() => useDishes('est-1'))

    // Act
    await waitFor(() => {
      expect(ownerApi.getDishes).toHaveBeenCalledWith('est-1', undefined)
    })
    act(() => {
      result.current.toggleTag(9)
    })

    // Assert
    await waitFor(() => {
      expect(ownerApi.getDishes).toHaveBeenCalledWith('est-1', [9])
    })
    expect(result.current.selectedTags).toEqual([9])
  })
})
