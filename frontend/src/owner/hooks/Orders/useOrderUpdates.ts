import { useEffect, useCallback, useRef } from 'react'
import { websocketService } from '../../../shared/services/websocket'
import { Order } from '../../../shared/types/order'

interface OrderUpdateMessage {
  type: 'order_created' | 'order_updated' | 'order_status_changed'
  order: Order
  timestamp: string
}

interface UseOrderUpdatesOptions {
  establishmentCode: string
  onOrderCreated?: (order: Order) => void
  onOrderUpdated?: (order: Order) => void
  onOrderStatusChanged?: (order: Order) => void
  enabled?: boolean
}

/**
 * Hook para escutar atualizações de pedidos em tempo real via WebSocket
 */
export function useOrderUpdates({
  establishmentCode,
  onOrderCreated,
  onOrderUpdated,
  onOrderStatusChanged,
  enabled = true,
}: UseOrderUpdatesOptions) {
  const callbacksRef = useRef({
    onOrderCreated,
    onOrderUpdated,
    onOrderStatusChanged,
  })

  // Atualizar callbacks ref quando mudarem
  useEffect(() => {
    callbacksRef.current = {
      onOrderCreated,
      onOrderUpdated,
      onOrderStatusChanged,
    }
  }, [onOrderCreated, onOrderUpdated, onOrderStatusChanged])

  useEffect(() => {
    if (!enabled || !establishmentCode) {
      return
    }

    // Conectar ao WebSocket se ainda não estiver conectado
    if (!websocketService.isConnected()) {
      websocketService.connect()
    }

    // Subscrever ao canal de pedidos
    const unsubscribe = websocketService.subscribe(
      'OrdersChannel',
      {},
      {
        received: (message: OrderUpdateMessage) => {
          const { type, order } = message

          switch (type) {
            case 'order_created':
              callbacksRef.current.onOrderCreated?.(order)
              break
            case 'order_updated':
              callbacksRef.current.onOrderUpdated?.(order)
              break
            case 'order_status_changed':
              callbacksRef.current.onOrderStatusChanged?.(order)
              break
            default:
              console.warn('[useOrderUpdates] Unknown message type:', type)
          }
        },
        connected: () => {
          console.log('[useOrderUpdates] Subscribed to OrdersChannel')
        },
        disconnected: () => {
          console.log('[useOrderUpdates] Disconnected from OrdersChannel')
        },
      }
    )

    // Cleanup: unsubscribe quando componente desmontar ou dependências mudarem
    return () => {
      unsubscribe()
    }
  }, [establishmentCode, enabled])

  // Função para reconectar manualmente
  const reconnect = useCallback(() => {
    websocketService.disconnect()
    websocketService.connect()
  }, [])

  return {
    isConnected: websocketService.isConnected(),
    reconnect,
  }
}
