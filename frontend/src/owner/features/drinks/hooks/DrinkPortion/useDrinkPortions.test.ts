import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDrinkPortions } from './useDrinkPortions'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getDrinkPortions: vi.fn(),
  },
}))

describe('useDrinkPortions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads portions when establishment and drink id are provided', async () => {
    // Arrange
    vi.mocked(ownerApi.getDrinkPortions).mockResolvedValue({
      data: [{ id: 1, description: 'Pequena', price: 9.9 }],
    } as any)

    // Act
    const { result } = renderHook(() => useDrinkPortions('est-1', 44))

    // Assert
    await waitFor(() => {
      expect(result.current.portions).toEqual([{ id: 1, description: 'Pequena', price: 9.9 }])
    })
    expect(ownerApi.getDrinkPortions).toHaveBeenCalledWith('est-1', 44)
  })

  it('does not request portions when params are missing', async () => {
    // Arrange / Act
    renderHook(() => useDrinkPortions(undefined, 44))
    renderHook(() => useDrinkPortions('est-1', undefined))

    // Assert
    await waitFor(() => {
      expect(ownerApi.getDrinkPortions).not.toHaveBeenCalled()
    })
  })
})
