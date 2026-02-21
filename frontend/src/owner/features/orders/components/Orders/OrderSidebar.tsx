import { Link } from 'react-router-dom'
import { useOrderSidebar } from '../../hooks/Orders/useOrderSidebar'
import {
  OrderSidebarProps,
  OrderSidebarItemProps
} from '../../types/order'
import type { OrderMenuItem } from '../../types/order'
import '../../../../../css/owner/OrderSidebar.css'

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
    activeOrders,
    activeOrdersTotal,
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

  // Só mostrar lista de pedidos ativos se realmente não houver currentOrder
  if (!currentOrder) {
    return (
      <aside className="order-sidebar">
        {activeOrders && activeOrders.length > 0 ? (
          <>
            <div className="order-sidebar-header">
              <h2 className="order-sidebar-title">Pedidos Ativos</h2>
            </div>
            
            <div className="order-sidebar-items">
              <div className="order-sidebar-items-header">
                <span>Código</span>
                <span>Status</span>
                <span>Total</span>
              </div>

              {activeOrders.map((order) => (
                <div key={order.id} className="order-sidebar-item">
                  <div className="order-sidebar-item-content">
                    <div className="order-sidebar-item-main">
                      <div className="order-sidebar-item-info">
                        <div className="order-sidebar-item-name">#{order.code}</div>
                        <div className="order-sidebar-item-unit-price">
                          {order.status === 'draft' ? 'Rascunho' : 'Pendente'}
                        </div>
                      </div>
                      <div className="order-sidebar-item-row">
                        <div className="order-sidebar-item-total">
                          R$ {typeof order.total_price === 'number' 
                            ? order.total_price.toFixed(2) 
                            : Number(order.total_price || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-sidebar-summary">
              <div className="order-sidebar-summary-row order-sidebar-summary-total">
                <span>Total Geral</span>
                <span>R$ {activeOrdersTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to={establishmentCode ? `/establishment/${establishmentCode}/orders` : '#'}
              className="order-sidebar-link-btn"
              style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}
            >
              Ver Todos os Pedidos
            </Link>
          </>
        ) : (
          <div className="order-sidebar-empty">
            <p>Nenhum pedido ativo</p>
            <Link
              to={establishmentCode ? `/establishment/${establishmentCode}/orders` : '#'}
              className="order-sidebar-link-btn"
            >
              Ver Todos os Pedidos
            </Link>
          </div>
        )}
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

        {itemsCount === 0 ? (
          <div className="order-sidebar-empty-items">
            <p>Nenhum item no pedido</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Adicione itens ao pedido
            </p>
          </div>
        ) : (
          currentOrder.order_menu_items?.map((item: OrderMenuItem) => (
            <OrderSidebarItem
              key={item.id}
              item={item}
              onRemove={handleRemoveItem}
              removing={removingId === item.id}
            />
          ))
        )}
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
  // Se é um menu completo
  if (item.menu_id && item.menu) {
    const displayName = item.menu.name
    const unitPrice = typeof item.menu.price === 'number' ? item.menu.price : Number(item.menu.price) || 0
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
                R$ {Number(unitPrice).toFixed(2)}
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
                R$ {Number(totalPrice).toFixed(2)}
              </div>
              <button
                type="button"
                className="order-sidebar-item-remove"
                title="Remover item do pedido"
                onClick={() => onRemove(item.id)}
                disabled={removing}
                aria-label={`Remover ${displayName}`}
              >
                {removing ? '…' : <img src="/lixeira-de-reciclagem.png" alt="Remover" />}
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

  // Item individual (menu_item + portion)
  // O backend pode retornar menu_item_name diretamente ou dentro de menu_item
  const itemName = (item as any).menu_item_name || item.menu_item?.name || 'Item'
  const portionName = item.portion?.name || item.portion?.description || ''
  const displayName = portionName ? `${itemName} - ${portionName}` : itemName
  
  // O preço pode estar em portion.price ou em portion_price (atributo calculado do serializer)
  const hasPortion = !!item.portion
  const portionPrice = item.portion?.price || (item as any).portion_price
  const portionPriceType = typeof portionPrice
  const portionPriceNumber = portionPriceType === 'number' 
    ? portionPrice as number
    : (portionPrice ? Number(portionPrice) : null)
  
  const unitPrice: number = portionPriceNumber !== null && !isNaN(portionPriceNumber) && portionPriceNumber > 0
    ? portionPriceNumber 
    : 0
  const totalPrice: number = unitPrice * item.quantity

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
              {unitPrice > 0 ? `R$ ${Number(unitPrice).toFixed(2)}` : 'Preço não disponível'}
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
              {totalPrice > 0 ? `R$ ${Number(totalPrice).toFixed(2)}` : 'R$ 0,00'}
            </div>
            <button
              type="button"
              className="order-sidebar-item-remove"
              title="Remover item do pedido"
              onClick={() => onRemove(item.id)}
              disabled={removing}
              aria-label={`Remover ${displayName}`}
            >
              {removing ? '…' : <img src="/lixeira-de-reciclagem.png" alt="Remover" />}
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
