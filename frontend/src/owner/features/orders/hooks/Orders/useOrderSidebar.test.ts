import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useOrderSidebar } from './useOrderSidebar'
import { ownerApi } from '../../../../shared/services/api'
import { useCurrentOrder } from './useCurrentOrder'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getOrders: vi.fn(),
    removeOrderItem: vi.fn(),
    invalidateOrderCache: vi.fn(),
  },
}))

vi.mock('./useCurrentOrder', () => ({
  useCurrentOrder: vi.fn(),
}))

vi.mock('./useOrderUpdates', () => ({
  useOrderUpdates: vi.fn(),
}))

describe('useOrderSidebar', () => {
  const loadOrderMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('loads and filters active orders when there is no current order', async () => {
    // Arrange
    vi.mocked(useCurrentOrder).mockReturnValue({
      currentOrder: null,
      loading: false,
      totals: { subtotal: 0, tax: 0, serviceFee: 0, total: 0 },
      itemsCount: 0,
      loadOrder: loadOrderMock,
    } as any)
    vi.mocked(ownerApi.getOrders).mockResolvedValue({
      data: [
        { id: 1, code: 'ORD-1', status: 'draft', total_price: 10 },
        { id: 2, code: 'ORD-2', status: 'pending', total_price: 20 },
        { id: 3, code: 'ORD-3', status: 'delivered', total_price: 30 },
      ],
    } as any)

    // Act
    const { result } = renderHook(() => useOrderSidebar({ establishmentCode: 'est-1' }))

    // Assert
    await waitFor(() => {
      expect(result.current.activeOrders).toHaveLength(2)
    })
    expect(result.current.activeOrdersTotal).toBe(30)
  })

  it('removes item, invalidates cache and reloads current order', async () => {
    // Arrange
    vi.mocked(useCurrentOrder).mockReturnValue({
      currentOrder: { code: 'ORD-10' },
      loading: false,
      totals: { subtotal: 0, tax: 0, serviceFee: 0, total: 0 },
      itemsCount: 0,
      loadOrder: loadOrderMock,
    } as any)
    vi.mocked(ownerApi.removeOrderItem).mockResolvedValue({ data: { ok: true } } as any)

    // Act
    const { result } = renderHook(() => useOrderSidebar({ establishmentCode: 'est-1' }))
    await act(async () => {
      await result.current.handleRemoveItem(99)
    })

    // Assert
    expect(ownerApi.removeOrderItem).toHaveBeenCalledWith('est-1', 'ORD-10', 99)
    expect(ownerApi.invalidateOrderCache).toHaveBeenCalledWith('est-1', 'ORD-10')
    expect(loadOrderMock).toHaveBeenCalledWith('ORD-10', true)
  })

  it('navigates to orders page when handleGoToOrders is called', async () => {
    // Arrange
    vi.mocked(useCurrentOrder).mockReturnValue({
      currentOrder: null,
      loading: false,
      totals: { subtotal: 0, tax: 0, serviceFee: 0, total: 0 },
      itemsCount: 0,
      loadOrder: loadOrderMock,
    } as any)
    vi.mocked(ownerApi.getOrders).mockResolvedValue({ data: [] } as any)
    const { result } = renderHook(() => useOrderSidebar({ establishmentCode: 'est-1' }))
    await waitFor(() => {
      expect(ownerApi.getOrders).toHaveBeenCalled()
    })

    // Act
    result.current.handleGoToOrders()

    // Assert
    expect(navigateMock).toHaveBeenCalledWith('/establishment/est-1/orders')
  })
})
