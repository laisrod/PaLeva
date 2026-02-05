import { useEffect, useState } from 'react'
import { notificationService, Notification } from '../services/notifications'
import '../../css/shared/NotificationToast.css'

export default function NotificationToast() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notification) => {
      console.log('[NotificationToast] Received notification:', notification)
      setNotifications((prev) => {
        const updated = [...prev, notification]
        console.log('[NotificationToast] Updated notifications state:', updated)
        return updated
      })

      // Remover notificação após a duração especificada
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
      }, notification.duration || 5000)
    })

    // Teste: mostrar uma notificação de teste após 2 segundos (apenas em desenvolvimento)
    if (import.meta.env.DEV) {
      const testTimeout = setTimeout(() => {
        console.log('[NotificationToast] Sending test notification')
        notificationService.info(
          'Sistema de Notificações',
          'Se você está vendo isso, o sistema está funcionando!'
        )
      }, 2000)

      return () => {
        unsubscribe()
        clearTimeout(testTimeout)
      }
    }

    return unsubscribe
  }, [])

  const handleClose = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      default:
        return 'i'
    }
  }

  console.log('[NotificationToast] Rendering with notifications:', notifications.length, notifications)

  // Expor função de teste globalmente em desenvolvimento
  useEffect(() => {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      (window as any).testNotification = () => {
        console.log('[NotificationToast] Test notification triggered')
        notificationService.info(
          'Teste de Notificação',
          'Esta é uma notificação de teste! Se você está vendo isso, o sistema está funcionando.'
        )
      }
    }
  }, [])

  if (notifications.length === 0) {
    console.log('[NotificationToast] No notifications to render')
  }

  return (
    <div className="notification-container" style={{ zIndex: 99999 }}>
      {notifications.map((notification) => {
        console.log('[NotificationToast] Rendering notification:', notification.id, notification.title)
        return (
          <div
            key={notification.id}
            className={`notification-toast notification-${notification.type}`}
            onClick={() => handleClose(notification.id)}
            style={{ 
              display: 'flex',
              visibility: 'visible',
              opacity: 1,
              position: 'relative',
              zIndex: 99999
            }}
          >
            <div className="notification-icon">{getIcon(notification.type)}</div>
            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
              {notification.order_code && (
                <div className="notification-order">Pedido #{notification.order_code}</div>
              )}
            </div>
            <button
              className="notification-close"
              onClick={(e) => {
                e.stopPropagation()
                handleClose(notification.id)
              }}
              aria-label="Fechar notificação"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
