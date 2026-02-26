import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAddOrderItem } from './useAddOrderItem'
import { ownerApi } from '../../../../shared/services/api'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    addOrderItem: vi.fn(),
    invalidateOrderCache: vi.fn(),
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn(),
}))

describe('useAddOrderItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('alert', vi.fn())
    vi.mocked(getErrorMessage).mockImplementation((response: any) => response?.error || '')
  })

  it('returns validation error when order code is missing', async () => {
    // Arrange
    const { result } = renderHook(() =>
      useAddOrderItem({ establishmentCode: 'est-1', orderCode: '', onSuccess: vi.fn() })
    )

    // Act
    let success = false
    await act(async () => {
      success = await result.current.addItem({ dishId: 10, portionId: 2 })
    })

    // Assert
    expect(success).toBe(false)
    expect(result.current.error).toBe('Código do estabelecimento ou pedido não encontrado')
    expect(alert).toHaveBeenCalledWith('Código do estabelecimento ou pedido não encontrado')
    expect(ownerApi.addOrderItem).not.toHaveBeenCalled()
  })

  it('adds item successfully and invalidates cache with override order code', async () => {
    // Arrange
    const onSuccess = vi.fn()
    vi.mocked(ownerApi.addOrderItem).mockResolvedValue({ data: { order: { code: 'ORD-2' } } } as any)
    const { result } = renderHook(() =>
      useAddOrderItem({ establishmentCode: 'est-1', orderCode: 'ORD-1', onSuccess })
    )

    // Act
    let success = false
    await act(async () => {
      success = await result.current.addItem({ dishId: 10, portionId: 2, quantity: 1 }, 'ORD-2')
    })

    // Assert
    expect(success).toBe(true)
    expect(ownerApi.addOrderItem).toHaveBeenCalledWith('est-1', 'ORD-2', {
      dishId: 10,
      portionId: 2,
      quantity: 1,
    })
    expect(ownerApi.invalidateOrderCache).toHaveBeenCalledWith('est-1', 'ORD-2')
    expect(onSuccess).toHaveBeenCalledWith('ORD-2')
  })

  it('surfaces API error when add item request fails', async () => {
    // Arrange
    vi.mocked(ownerApi.addOrderItem).mockResolvedValue({ error: 'Item inválido' } as any)
    vi.mocked(getErrorMessage).mockReturnValue('Item inválido')
    const { result } = renderHook(() =>
      useAddOrderItem({ establishmentCode: 'est-1', orderCode: 'ORD-1' })
    )

    // Act
    let success = true
    await act(async () => {
      success = await result.current.addItem({ dishId: 10, portionId: 2 })
    })

    // Assert
    expect(success).toBe(false)
    expect(result.current.error).toBe('Item inválido')
    expect(alert).toHaveBeenCalledWith('Item inválido')
  })
})
