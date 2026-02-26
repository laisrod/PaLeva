import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDrink } from './useDrink'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getDrink: vi.fn(),
  },
}))

describe('useDrink', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads drink details when drink id and establishment code are available', async () => {
    // Arrange
    vi.mocked(ownerApi.getDrink).mockResolvedValue({
      data: { id: 8, name: 'Suco de Laranja', description: 'Natural' },
    } as any)

    // Act
    const { result } = renderHook(() =>
      useDrink({ drinkId: 8, establishmentCode: 'est-1' })
    )

    // Assert
    await waitFor(() => {
      expect(result.current.drink).toEqual({
        id: 8,
        name: 'Suco de Laranja',
        description: 'Natural',
      })
    })
    expect(ownerApi.getDrink).toHaveBeenCalledWith('est-1', 8)
  })

  it('does not request drink when params are missing', async () => {
    // Arrange / Act
    renderHook(() => useDrink({ drinkId: undefined, establishmentCode: 'est-1' }))
    renderHook(() => useDrink({ drinkId: 8, establishmentCode: undefined }))

    // Assert
    await waitFor(() => {
      expect(ownerApi.getDrink).not.toHaveBeenCalled()
    })
  })
})
