import { useNotificationToast } from '../hooks/useNotificationToast'
import { getNotificationIcon } from '../utils/notificationUtils'
import '../../css/shared/NotificationToast.css'

export default function NotificationToast() {
  const { notifications, handleClose } = useNotificationToast()

  return (
    <div className="notification-container" style={{ zIndex: 99999 }}>
      {notifications.map((notification) => (
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
          <div className="notification-icon">{getNotificationIcon(notification.type)}</div>
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
      ))}
    </div>
  )
}
