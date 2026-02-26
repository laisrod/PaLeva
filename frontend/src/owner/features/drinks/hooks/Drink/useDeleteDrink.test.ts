import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeleteDrink } from './useDeleteDrink'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    deleteDrink: vi.fn(),
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useDeleteDrink', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns validation error when establishment code is missing', async () => {
    // Arrange
    const { result } = renderHook(() =>
      useDeleteDrink({ establishmentCode: undefined })
    )

    // Act
    let success = true
    await act(async () => {
      success = await result.current.deleteDrink(10)
    })

    // Assert
    expect(success).toBe(false)
    expect(result.current.error).toBe('Código do estabelecimento não encontrado')
    expect(ownerApi.deleteDrink).not.toHaveBeenCalled()
  })

  it('deletes drink and triggers onSuccess when api returns data', async () => {
    // Arrange
    const onSuccess = vi.fn()
    vi.mocked(ownerApi.deleteDrink).mockResolvedValue({ data: { message: 'ok' } } as any)
    const { result } = renderHook(() =>
      useDeleteDrink({ establishmentCode: 'est-1', onSuccess })
    )

    // Act
    let success = false
    await act(async () => {
      success = await result.current.deleteDrink(11)
    })

    // Assert
    expect(success).toBe(true)
    expect(ownerApi.deleteDrink).toHaveBeenCalledWith('est-1', 11)
    expect(onSuccess).toHaveBeenCalled()
  })
})
