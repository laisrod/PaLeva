import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useOrderUpdates } from './useOrderUpdates'
import { websocketService } from '../../../../../shared/services/websocket'

vi.mock('../../../../../shared/services/websocket', () => ({
  websocketService: {
    isConnected: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    subscribe: vi.fn(),
  },
}))

describe('useOrderUpdates', () => {
  const unsubscribeMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(websocketService.isConnected).mockReturnValue(false)
    vi.mocked(websocketService.subscribe).mockReturnValue(unsubscribeMock)
  })

  it('connects and subscribes, then routes received events to callbacks', () => {
    // Arrange
    const onOrderCreated = vi.fn()
    const onOrderUpdated = vi.fn()
    const onOrderStatusChanged = vi.fn()

    // Act
    const { unmount } = renderHook(() =>
      useOrderUpdates({
        establishmentCode: 'est-1',
        enabled: true,
        onOrderCreated,
        onOrderUpdated,
        onOrderStatusChanged,
      })
    )

    // Assert
    expect(websocketService.connect).toHaveBeenCalled()
    expect(websocketService.subscribe).toHaveBeenCalledWith(
      'OrdersChannel',
      {},
      expect.objectContaining({
        received: expect.any(Function),
      })
    )

    const callbacks = vi.mocked(websocketService.subscribe).mock.calls[0][2] as any
    callbacks.received({ type: 'order_created', order: { code: 'ORD-1' }, timestamp: 't' })
    callbacks.received({ type: 'order_updated', order: { code: 'ORD-2' }, timestamp: 't' })
    callbacks.received({ type: 'order_status_changed', order: { code: 'ORD-3' }, timestamp: 't' })
    expect(onOrderCreated).toHaveBeenCalledWith({ code: 'ORD-1' })
    expect(onOrderUpdated).toHaveBeenCalledWith({ code: 'ORD-2' })
    expect(onOrderStatusChanged).toHaveBeenCalledWith({ code: 'ORD-3' })

    unmount()
    expect(unsubscribeMock).toHaveBeenCalled()
  })

  it('reconnect disconnects and connects websocket again', () => {
    // Arrange
    const { result } = renderHook(() =>
      useOrderUpdates({
        establishmentCode: 'est-1',
        enabled: true,
      })
    )

    // Act
    result.current.reconnect()

    // Assert
    expect(websocketService.disconnect).toHaveBeenCalled()
    expect(websocketService.connect).toHaveBeenCalledTimes(2)
  })
})
