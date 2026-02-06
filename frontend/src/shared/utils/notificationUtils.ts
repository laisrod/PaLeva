import { Notification } from '../services/notifications'

export function getNotificationIcon(type: Notification['type']): string {
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
