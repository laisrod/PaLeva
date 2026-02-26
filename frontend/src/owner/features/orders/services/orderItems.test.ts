import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OrderItemsApi } from './orderItems'

describe('OrderItemsApi', () => {
  let api: OrderItemsApi
  let requestSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    api = new OrderItemsApi()
    requestSpy = vi.spyOn(api as any, 'request').mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('builds payload with menu item and portion when adding an item', async () => {
    // Arrange
    const options = { menuItemId: 10, portionId: 4, quantity: 2 }

    // Act
    await api.addItem('est-1', 'ORD-1', options)

    // Assert
    expect(requestSpy).toHaveBeenCalledWith(
      '/establishments/est-1/orders/ORD-1/items',
      expect.objectContaining({
        method: 'POST',
      })
    )
    const requestOptions = requestSpy.mock.calls[0][1] as RequestInit
    expect(JSON.parse(requestOptions.body as string)).toEqual({
      order_item: {
        menu_item_id: 10,
        portion_id: 4,
        quantity: 2,
      },
    })
  })

  it('builds payload with menu id and default quantity when menu is selected', async () => {
    // Arrange
    const options = { menuId: 5 }

    // Act
    await api.addItem('est-2', 'ORD-2', options)

    // Assert
    const requestOptions = requestSpy.mock.calls[0][1] as RequestInit
    expect(JSON.parse(requestOptions.body as string)).toEqual({
      order_item: {
        menu_id: 5,
        quantity: 1,
      },
    })
  })

  it('sends DELETE request when removing an item', async () => {
    // Arrange
    const itemId = 123

    // Act
    await api.removeItem('est-3', 'ORD-3', itemId)

    // Assert
    expect(requestSpy).toHaveBeenCalledWith(
      '/establishments/est-3/orders/ORD-3/items/123',
      { method: 'DELETE' }
    )
  })
})
