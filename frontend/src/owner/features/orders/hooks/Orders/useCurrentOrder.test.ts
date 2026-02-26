import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCurrentOrder } from './useCurrentOrder'
import { ownerApi } from '../../../../shared/services/api'
import { useCreateOrder } from './useCreateOrder'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getOrder: vi.fn(),
  },
}))

vi.mock('./useCreateOrder', () => ({
  useCreateOrder: vi.fn(),
}))

describe('useCurrentOrder', () => {
  const createOrderMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    createOrderMock.mockReset()
    vi.mocked(useCreateOrder).mockReturnValue({
      createOrder: createOrderMock,
      loading: false,
      error: null,
    } as any)
  })

  it('sets error when trying to load order without establishment code', async () => {
    // Arrange
    const { result } = renderHook(() => useCurrentOrder({ establishmentCode: undefined }))

    // Act
    await act(async () => {
      await result.current.loadOrder('ORD-1')
    })

    // Assert
    expect(result.current.error).toBe('Código do estabelecimento não encontrado')
    expect(ownerApi.getOrder).not.toHaveBeenCalled()
  })

  it('normalizes order payload and calculates totals', async () => {
    // Arrange
    vi.mocked(ownerApi.getOrder).mockResolvedValue({
      data: {
        order: {
          id: 1,
          order_menu_items: {
            a: { id: 11, quantity: 2, portion: { price: 10 } },
            b: { id: 12, quantity: 1, portion: { price: 20 } },
          },
        },
      },
    } as any)
    const { result } = renderHook(() => useCurrentOrder({ establishmentCode: 'est-1' }))

    // Act
    await act(async () => {
      await result.current.loadOrder('ORD-200')
    })

    // Assert
    expect(result.current.currentOrder?.code).toBe('ORD-200')
    expect(result.current.itemsCount).toBe(2)
    expect(result.current.totals).toEqual({
      subtotal: 40,
      serviceFee: 2,
      tax: 4,
      total: 46,
    })
  })

  it('creates a new order and persists order code in localStorage', async () => {
    // Arrange
    createOrderMock.mockResolvedValue({ code: 'ORD-NEW' })
    vi.mocked(ownerApi.getOrder).mockResolvedValue({
      data: { code: 'ORD-NEW', order_menu_items: [] },
    } as any)
    const { result } = renderHook(() => useCurrentOrder({ establishmentCode: 'est-2' }))

    // Act
    await act(async () => {
      await result.current.createNewOrder('Lais')
    })

    // Assert
    expect(createOrderMock).toHaveBeenCalledWith('Lais')
    expect(localStorage.getItem('current_order_est-2')).toBe('ORD-NEW')
    expect(ownerApi.getOrder).toHaveBeenCalledWith('est-2', 'ORD-NEW')
  })

  it('clears current order and removes it from localStorage', async () => {
    // Arrange
    localStorage.setItem('current_order_est-3', 'ORD-OLD')
    vi.mocked(ownerApi.getOrder).mockResolvedValue({
      data: { code: 'ORD-OLD', order_menu_items: [] },
    } as any)
    const { result } = renderHook(() => useCurrentOrder({ establishmentCode: 'est-3' }))
    await waitFor(() => expect(result.current.currentOrder?.code).toBe('ORD-OLD'))

    // Act
    act(() => {
      result.current.clearOrder()
    })

    // Assert
    expect(result.current.currentOrder).toBeNull()
    expect(result.current.error).toBeNull()
    expect(localStorage.getItem('current_order_est-3')).toBeNull()
  })
})
