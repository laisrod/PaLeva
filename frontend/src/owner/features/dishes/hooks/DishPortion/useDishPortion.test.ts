import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDishPortion } from './useDishPortion'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getPortion: vi.fn(),
  },
}))

describe('useDishPortion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads portion details when ids and code are available', async () => {
    // Arrange
    vi.mocked(ownerApi.getPortion).mockResolvedValue({
      data: { id: 3, description: 'Grande', price: 19.9 },
    } as any)

    // Act
    const { result } = renderHook(() =>
      useDishPortion({ portionId: 3, establishmentCode: 'est-1', dishId: 10 })
    )

    // Assert
    await waitFor(() => {
      expect(result.current.portion).toEqual({
        id: 3,
        description: 'Grande',
        price: 19.9,
      })
    })
    expect(ownerApi.getPortion).toHaveBeenCalledWith('est-1', 10, 3)
  })

  it('does not request portion when params are missing', async () => {
    // Arrange / Act
    renderHook(() =>
      useDishPortion({ portionId: undefined, establishmentCode: 'est-1', dishId: 10 })
    )
    renderHook(() =>
      useDishPortion({ portionId: 3, establishmentCode: undefined, dishId: 10 })
    )
    renderHook(() =>
      useDishPortion({ portionId: 3, establishmentCode: 'est-1', dishId: undefined })
    )

    // Assert
    await waitFor(() => {
      expect(ownerApi.getPortion).not.toHaveBeenCalled()
    })
  })
})
