import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeleteDrinkPortion } from './useDeleteDrinkPortion'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    deleteDrinkPortion: vi.fn(),
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useDeleteDrinkPortion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns validation error when establishment or drink id is missing', async () => {
    // Arrange
    const { result } = renderHook(() =>
      useDeleteDrinkPortion({ establishmentCode: 'est-1', drinkId: undefined })
    )

    // Act
    let success = true
    await act(async () => {
      success = await result.current.deletePortion(7)
    })

    // Assert
    expect(success).toBe(false)
    expect(result.current.error).toBe('Código do estabelecimento ou ID da bebida não encontrado')
  })

  it('deletes portion and triggers onSuccess when api returns data', async () => {
    // Arrange
    const onSuccess = vi.fn()
    vi.mocked(ownerApi.deleteDrinkPortion).mockResolvedValue({ data: { message: 'ok' } } as any)
    const { result } = renderHook(() =>
      useDeleteDrinkPortion({ establishmentCode: 'est-1', drinkId: 10, onSuccess })
    )

    // Act
    let success = false
    await act(async () => {
      success = await result.current.deletePortion(7)
    })

    // Assert
    expect(success).toBe(true)
    expect(ownerApi.deleteDrinkPortion).toHaveBeenCalledWith('est-1', 10, 7)
    expect(onSuccess).toHaveBeenCalled()
  })
})
