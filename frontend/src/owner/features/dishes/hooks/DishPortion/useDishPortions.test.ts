import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDishPortions } from './useDishPortions'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getPortions: vi.fn(),
  },
}))

describe('useDishPortions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads portions when establishment and dish id are provided', async () => {
    // Arrange
    vi.mocked(ownerApi.getPortions).mockResolvedValue({
      data: [{ id: 1, description: 'Pequena', price: 9.9 }],
    } as any)

    // Act
    const { result } = renderHook(() => useDishPortions('est-1', 44))

    // Assert
    await waitFor(() => {
      expect(result.current.portions).toEqual([{ id: 1, description: 'Pequena', price: 9.9 }])
    })
    expect(ownerApi.getPortions).toHaveBeenCalledWith('est-1', 44)
  })

  it('does not request portions when params are missing', async () => {
    // Arrange / Act
    renderHook(() => useDishPortions(undefined, 44))
    renderHook(() => useDishPortions('est-1', undefined))

    // Assert
    await waitFor(() => {
      expect(ownerApi.getPortions).not.toHaveBeenCalled()
    })
  })
})
