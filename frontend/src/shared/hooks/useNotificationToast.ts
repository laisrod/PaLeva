import { useEffect, useState } from 'react'
import { notificationService, Notification } from '../services/notifications'

export function useNotificationToast() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notification) => {
      setNotifications((prev) => {
        const updated = [...prev, notification]
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

  // Expor função de teste globalmente em desenvolvimento
  useEffect(() => {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      (window as any).testNotification = () => {
        notificationService.info(
          'Teste de Notificação',
          'Esta é uma notificação de teste! Se você está vendo isso, o sistema está funcionando.'
        )
      }
    }
  }, [])

  const handleClose = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return {
    notifications,
    handleClose
  }
}
