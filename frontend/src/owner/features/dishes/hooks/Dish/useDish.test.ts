import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDish } from './useDish'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getDish: vi.fn(),
  },
}))

describe('useDish', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads dish details when dish id and establishment code are available', async () => {
    // Arrange
    vi.mocked(ownerApi.getDish).mockResolvedValue({
      data: { id: 8, name: 'Feijoada', description: 'Tradicional' },
    } as any)

    // Act
    const { result } = renderHook(() =>
      useDish({ dishId: 8, establishmentCode: 'est-1' })
    )

    // Assert
    await waitFor(() => {
      expect(result.current.dish).toEqual({
        id: 8,
        name: 'Feijoada',
        description: 'Tradicional',
      })
    })
    expect(ownerApi.getDish).toHaveBeenCalledWith('est-1', 8)
  })

  it('does not request dish when params are missing', async () => {
    // Arrange / Act
    renderHook(() => useDish({ dishId: undefined, establishmentCode: 'est-1' }))
    renderHook(() => useDish({ dishId: 8, establishmentCode: undefined }))

    // Assert
    await waitFor(() => {
      expect(ownerApi.getDish).not.toHaveBeenCalled()
    })
  })
})
