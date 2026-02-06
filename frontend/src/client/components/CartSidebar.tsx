import { CartSidebarProps } from '../types/cart'
import { calculateItemCount, formatItemCount } from '../utils/cartUtils'
import '../../css/client/components/CartSidebar.css'

export default function CartSidebar({
  cart,
  orderType,
  showCart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onToggleCart,
  subtotal,
  deliveryFee,
  packagingFee,
  total,
  onCheckout,
  checkoutLoading = false
}: CartSidebarProps) {
  const itemCount = calculateItemCount(cart)

  return (
    <>
      {itemCount > 0 && (
        <button className="cart-toggle" onClick={onToggleCart}>
          <span className="cart-icon">🛒</span>
          <span className="cart-count">{itemCount}</span>
        </button>
      )}

      {showCart && <div className="cart-overlay" onClick={onClose} />}
      
      {/* Desktop: sempre mostra | Mobile: só mostra quando showCart é true */}
      <div className={`cart-sidebar ${showCart ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>
            Seu Pedido
            {itemCount > 0 && (
              <span className="cart-item-count">({itemCount} {formatItemCount(itemCount)})</span>
            )}
          </h2>
          <button className="close-cart" onClick={onClose}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">Carrinho vazio</p>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${item.portion}-${index}`} className="cart-item">
                {item.image && (
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                )}
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  {item.portion && <span className="cart-item-portion">{item.portion}</span>}
                  <div className="cart-item-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => onUpdateQuantity(item.id, item.portion, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => onUpdateQuantity(item.id, item.portion, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-price">
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    className="remove-item-btn"
                    onClick={() => onRemoveItem(item.id, item.portion)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <>
            <div className="add-to-order">
              <h3>Adicionar ao pedido</h3>
              <div className="suggestions">
                <button className="suggestion-item">
                  <span>Wasabi</span>
                  <span>€0.32</span>
                </button>
                <button className="suggestion-item">
                  <span>Gengibre</span>
                  <span>€0.32</span>
                </button>
              </div>
            </div>

            <div className="order-pickup">
              <h3>Tipo de Pedido</h3>
              <div className="pickup-options">
                <button className={`pickup-btn ${orderType === 'delivery' ? 'active' : ''}`}>
                  Delivery
                </button>
                <button className={`pickup-btn ${orderType === 'takeaway' ? 'active' : ''}`}>
                  Takeaway
                </button>
              </div>
              <input
                type="text"
                placeholder="Código promocional"
                className="promo-code"
              />
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="summary-row">
                  <span>Delivery</span>
                  <span>€{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Embalagem</span>
                <span>€{packagingFee.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              className="checkout-btn" 
              onClick={onCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? 'Processando...' : 'Finalizar Pedido'}
            </button>
          </>
        )}
      </div>
    </>
  )
}

