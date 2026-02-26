import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMenuCard } from './useMenuCard'
import { useCurrentOrder } from '../../../orders/hooks/Orders/useCurrentOrder'
import { useAddOrderItem } from '../../../orders/hooks/Orders/useAddOrderItem'

vi.mock('../../../orders/hooks/Orders/useCurrentOrder', () => ({
  useCurrentOrder: vi.fn(),
}))

vi.mock('../../../orders/hooks/Orders/useAddOrderItem', () => ({
  useAddOrderItem: vi.fn(),
}))

describe('useMenuCard', () => {
  const createNewOrder = vi.fn()
  const loadOrder = vi.fn()
  const addItem = vi.fn()
  const alertMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('alert', alertMock)
    vi.mocked(useAddOrderItem).mockReturnValue({
      addItem,
      loading: false,
      error: null,
    } as any)
  })

  it('creates order first when there is no current order', async () => {
    // Arrange
    createNewOrder.mockResolvedValue({ code: 'ORD-1' })
    vi.mocked(useCurrentOrder).mockReturnValue({
      currentOrder: null,
      createNewOrder,
      loadOrder,
    } as any)
    const { result } = renderHook(() => useMenuCard({ menuId: 9, establishmentCode: 'est-1' }))

    // Act
    await act(async () => {
      await result.current.handleAddToOrder()
    })

    // Assert
    expect(createNewOrder).toHaveBeenCalled()
  })

  it('adds menu directly when current order already exists', async () => {
    // Arrange
    vi.mocked(useCurrentOrder).mockReturnValue({
      currentOrder: { code: 'ORD-1' },
      createNewOrder,
      loadOrder,
    } as any)
    const { result } = renderHook(() => useMenuCard({ menuId: 9, establishmentCode: 'est-1' }))

    // Act
    await act(async () => {
      await result.current.handleAddToOrder()
    })

    // Assert
    expect(addItem).toHaveBeenCalledWith({ menuId: 9, quantity: 1 })
    expect(alertMock).not.toHaveBeenCalled()
  })
})
