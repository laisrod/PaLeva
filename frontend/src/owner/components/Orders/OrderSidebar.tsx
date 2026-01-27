import { Link } from 'react-router-dom'
import { useOrderSidebar } from '../../hooks/Orders/useOrderSidebar'
import {
  OrderSidebarProps,
  OrderSidebarItemProps
} from '../../types/order'
import { OrderMenuItem } from '../../../shared/types/order'
import '../../../css/owner/OrderSidebar.css'

export default function OrderSidebar(props: OrderSidebarProps) {
  const {
    establishmentCode,
    currentOrder,
    loading,
    totals,
    itemsCount,
    handleGoToOrders,
    handleRemoveItem,
    removingId,
  } = useOrderSidebar(props)

  if (loading) {
    return (
      <aside className="order-sidebar">
        <div className="order-sidebar-loading">
          Carregando...
        </div>
      </aside>
    )
  }

  if (!currentOrder || itemsCount === 0) {
    return (
      <aside className="order-sidebar">
        <div className="order-sidebar-empty">
          <p>Nenhum pedido ativo</p>
          <Link
            to={establishmentCode ? `/establishment/${establishmentCode}/orders` : '#'}
            className="order-sidebar-link-btn"
          >
            Ver Todos os Pedidos
          </Link>
        </div>
      </aside>
    )
  }

  return (
    <aside className="order-sidebar">
      <div className="order-sidebar-header">
        <Link
          to={establishmentCode ? `/establishment/${establishmentCode}/orders` : '#'}
          className="order-sidebar-title-link"
        >
          <h2 className="order-sidebar-title">Orders #{currentOrder.code}</h2>
        </Link>
      </div>

      <div className="order-sidebar-tabs">
        <button type="button" className="order-sidebar-tab active">
          Dine In
        </button>
        <button type="button" className="order-sidebar-tab">
          To Go
        </button>
        <button type="button" className="order-sidebar-tab">
          Delivery
        </button>
      </div>

      <div className="order-sidebar-items">
        <div className="order-sidebar-items-header">
          <span>Item</span>
          <span>Qty</span>
          <span>Price</span>
        </div>

        {currentOrder.order_menu_items?.map((item: OrderMenuItem) => (
          <OrderSidebarItem
            key={item.id}
            item={item}
            onRemove={handleRemoveItem}
            removing={removingId === item.id}
          />
        ))}
      </div>

      <div className="order-sidebar-summary">
        <div className="order-sidebar-summary-row">
          <span>Discount</span>
          <span>R$ 0.00</span>
        </div>
        <div className="order-sidebar-summary-row order-sidebar-summary-total">
          <span>Sub total</span>
          <span>R$ {totals.subtotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="button"
        className="order-sidebar-checkout"
        onClick={handleGoToOrders}
      >
        Continue to Payment
      </button>
    </aside>
  )
}

function OrderSidebarItem({ item, onRemove, removing }: OrderSidebarItemProps) {
  const itemName = item.menu_item?.name ?? 'Item'
  const portionName = item.portion?.name ?? item.portion?.description ?? ''
  const displayName = portionName ? `${itemName} - ${portionName}` : itemName
  const unitPrice = item.portion?.price ?? 0
  const totalPrice = unitPrice * item.quantity

  return (
    <div className="order-sidebar-item">
      <div className="order-sidebar-item-content">
        <div className="order-sidebar-item-image">
          <div className="order-sidebar-item-image-placeholder" aria-hidden />
        </div>
        <div className="order-sidebar-item-main">
          <div className="order-sidebar-item-info">
            <div className="order-sidebar-item-name">{displayName}</div>
            <div className="order-sidebar-item-unit-price">
              R$ {unitPrice.toFixed(2)}
            </div>
          </div>
          <div className="order-sidebar-item-row">
            <div className="order-sidebar-item-qty-box">
              <input
                type="number"
                min={1}
                value={item.quantity}
                readOnly
                className="order-sidebar-item-qty-input"
                aria-label={`Quantidade ${displayName}`}
              />
            </div>
            <div className="order-sidebar-item-total">
              R$ {totalPrice.toFixed(2)}
            </div>
            <button
              type="button"
              className="order-sidebar-item-remove"
              title="Remover item do pedido"
              onClick={() => onRemove(item.id)}
              disabled={removing}
              aria-label={`Remover ${displayName}`}
            >
              {removing ? '…' : '🗑️'}
            </button>
          </div>
          <input
            type="text"
            placeholder="Order Note..."
            className="order-sidebar-item-note"
            defaultValue={(item as { note?: string }).note ?? ''}
          />
        </div>
      </div>
    </div>
  )
}
