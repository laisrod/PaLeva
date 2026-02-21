import { useEffect } from 'react'
import { websocketService } from '../services/websocket'
import { notificationService, Notification } from '../services/notifications'
import { useAuth } from './useAuth'

interface NotificationMessage {
  type: string
  title: string
  message: string
  order_id?: number
  order_code?: string
  timestamp: string
}

export function useNotifications() {
  const { user, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    // Aguardar até que a autenticação seja verificada
    if (loading) {
      return
    }

    if (!isAuthenticated || !user) {
      // Desconectar WebSocket se não estiver autenticado
      if (websocketService.isConnected()) {
        websocketService.disconnect()
      }
      return
    }

    let unsubscribeFn: (() => void) | null = null
    let connectionCheckInterval: number | null = null

    // Função para fazer a subscription
    const doSubscribe = () => {
      // Subscrever ao canal de notificações
      unsubscribeFn = websocketService.subscribe(
        'NotificationsChannel',
        {},
        {
          received: (message: NotificationMessage) => {
            // Mapear o tipo da notificação do backend para o tipo do frontend
            const notificationType = message.type === 'error' ? 'error' :
                                     message.type === 'success' ? 'success' :
                                     message.type === 'warning' ? 'warning' : 'info'

            notificationService.show({
              type: notificationType,
              title: message.title,
              message: message.message,
              order_id: message.order_id,
              order_code: message.order_code,
              duration: notificationType === 'error' ? 7000 : 5000, // Erros ficam mais tempo
            })
          },
          connected: () => {
            // Subscribed to NotificationsChannel
          },
          disconnected: () => {
            // Disconnected from NotificationsChannel
          },
        }
      )
    }

    // Conectar ao WebSocket se ainda não estiver conectado
    if (!websocketService.isConnected()) {
      websocketService.connect()
      
      // Aguardar conexão antes de subscrever
      connectionCheckInterval = setInterval(() => {
        if (websocketService.isConnected()) {
          if (connectionCheckInterval) {
            clearInterval(connectionCheckInterval)
            connectionCheckInterval = null
          }
          doSubscribe()
        }
      }, 100)

      // Timeout de segurança
      setTimeout(() => {
        if (connectionCheckInterval) {
          clearInterval(connectionCheckInterval)
          connectionCheckInterval = null
        }
      }, 5000)
    } else {
      doSubscribe()
    }

    // Cleanup: unsubscribe quando componente desmontar ou dependências mudarem
    return () => {
      if (connectionCheckInterval) {
        clearInterval(connectionCheckInterval)
      }
      if (unsubscribeFn) {
        unsubscribeFn()
      }
    }
  }, [isAuthenticated, user, loading])

  return {
    show: notificationService.show.bind(notificationService),
    info: notificationService.info.bind(notificationService),
    success: notificationService.success.bind(notificationService),
    warning: notificationService.warning.bind(notificationService),
    error: notificationService.error.bind(notificationService),
  }
}
