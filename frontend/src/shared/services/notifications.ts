export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  order_id?: number
  order_code?: string
  timestamp: string
  duration?: number
}

type NotificationCallback = (notification: Notification) => void

class NotificationService {
  private listeners: Set<NotificationCallback> = new Set()
  private notificationIdCounter = 0

  subscribe(callback: NotificationCallback): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  private notify(notification: Notification) {
    this.listeners.forEach((callback) => {
      callback(notification)
    })
  }

  show(notification: Omit<Notification, 'id' | 'timestamp'>) {
    const fullNotification: Notification = {
      ...notification,
      id: `notification-${++this.notificationIdCounter}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      duration: notification.duration || 5000,
    }
    this.notify(fullNotification)
  }

  info(title: string, message: string, options?: { order_id?: number; order_code?: string; duration?: number }) {
    this.show({
      type: 'info',
      title,
      message,
      ...options,
    })
  }

  success(title: string, message: string, options?: { order_id?: number; order_code?: string; duration?: number }) {
    this.show({
      type: 'success',
      title,
      message,
      ...options,
    })
  }

  warning(title: string, message: string, options?: { order_id?: number; order_code?: string; duration?: number }) {
    this.show({
      type: 'warning',
      title,
      message,
      ...options,
    })
  }

  error(title: string, message: string, options?: { order_id?: number; order_code?: string; duration?: number }) {
    this.show({
      type: 'error',
      title,
      message,
      ...options,
    })
  }
}

export const notificationService = new NotificationService()

// Expor globalmente para debug (apenas em desenvolvimento)
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).notificationService = notificationService
}
