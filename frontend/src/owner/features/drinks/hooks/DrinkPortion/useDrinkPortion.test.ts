import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDrinkPortion } from './useDrinkPortion'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getDrinkPortion: vi.fn(),
  },
}))

describe('useDrinkPortion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads portion details when ids and code are available', async () => {
    // Arrange
    vi.mocked(ownerApi.getDrinkPortion).mockResolvedValue({
      data: { id: 3, description: 'Grande', price: 19.9 },
    } as any)

    // Act
    const { result } = renderHook(() =>
      useDrinkPortion({ portionId: 3, establishmentCode: 'est-1', drinkId: 10 })
    )

    // Assert
    await waitFor(() => {
      expect(result.current.portion).toEqual({
        id: 3,
        description: 'Grande',
        price: 19.9,
      })
    })
    expect(ownerApi.getDrinkPortion).toHaveBeenCalledWith('est-1', 10, 3)
  })

  it('does not request portion when params are missing', async () => {
    // Arrange / Act
    renderHook(() =>
      useDrinkPortion({ portionId: undefined, establishmentCode: 'est-1', drinkId: 10 })
    )
    renderHook(() =>
      useDrinkPortion({ portionId: 3, establishmentCode: undefined, drinkId: 10 })
    )
    renderHook(() =>
      useDrinkPortion({ portionId: 3, establishmentCode: 'est-1', drinkId: undefined })
    )

    // Assert
    await waitFor(() => {
      expect(ownerApi.getDrinkPortion).not.toHaveBeenCalled()
    })
  })
})
