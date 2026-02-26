import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeleteDish } from './useDeleteDish'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    deleteDish: vi.fn(),
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useDeleteDish', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns validation error when establishment code is missing', async () => {
    // Arrange
    const { result } = renderHook(() =>
      useDeleteDish({ establishmentCode: undefined })
    )

    // Act
    let success = true
    await act(async () => {
      success = await result.current.deleteDish(10)
    })

    // Assert
    expect(success).toBe(false)
    expect(result.current.error).toBe('Código do estabelecimento não encontrado')
    expect(ownerApi.deleteDish).not.toHaveBeenCalled()
  })

  it('deletes dish and triggers onSuccess when api returns data', async () => {
    // Arrange
    const onSuccess = vi.fn()
    vi.mocked(ownerApi.deleteDish).mockResolvedValue({ data: { message: 'ok' } } as any)
    const { result } = renderHook(() =>
      useDeleteDish({ establishmentCode: 'est-1', onSuccess })
    )

    // Act
    let success = false
    await act(async () => {
      success = await result.current.deleteDish(11)
    })

    // Assert
    expect(success).toBe(true)
    expect(ownerApi.deleteDish).toHaveBeenCalledWith('est-1', 11)
    expect(onSuccess).toHaveBeenCalled()
  })
})
