import '../../css/client/components/Navigation.css'

interface NavigationProps {
  orderType?: 'delivery' | 'takeaway'
  onOrderTypeChange?: (type: 'delivery' | 'takeaway') => void
  location?: string
  onLocationChange?: (location: string) => void
  cartItemCount?: number
  onCartClick?: () => void
}

export default function Navigation({
  orderType = 'delivery',
  onOrderTypeChange,
  location,
  onLocationChange,
  cartItemCount = 0,
  onCartClick
}: NavigationProps) {
  return (
    <nav className="navigation">
      <div className="nav-top-bar">
        <div className="nav-top-left">
          <div className="nav-logo">
            <span className="logo-text">PaLeva</span>
          </div>
          {onOrderTypeChange && (
            <div className="order-type-toggle">
              <button
                className={`order-type-btn ${orderType === 'delivery' ? 'active' : ''}`}
                onClick={() => onOrderTypeChange('delivery')}
              >
                Delivery
              </button>
              <button
                className={`order-type-btn ${orderType === 'takeaway' ? 'active' : ''}`}
                onClick={() => onOrderTypeChange('takeaway')}
              >
                Takeaway
              </button>
            </div>
          )}
          {onLocationChange && (
            <div className="location-selector-nav">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <select
                value={location || ''}
                onChange={(e) => onLocationChange(e.target.value)}
                className="location-select-nav"
              >
                <option value="">Selecione</option>
                <option value="omsk">Omsk</option>
                <option value="baker-street">123 Baker Street</option>
              </select>
            </div>
          )}
        </div>
        <div className="nav-top-right">
          <div className="order-info">
            <span className="order-time">Pedidos das 11:00 às 23:00</span>
            <span className="order-phone">8 800 700-67-76</span>
            <span className="order-phone-label">Ligações Grátis</span>
          </div>
          <div className="nav-actions">
            {onCartClick && (
              <button className="nav-action-btn cart-btn" onClick={onCartClick}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1046 17.8954 19 19 19C20.1046 19 21 18.1046 21 17V13M9 19.5C9.82843 19.5 10.5 20.1716 10.5 21C10.5 21.8284 9.82843 22.5 9 22.5C8.17157 22.5 7.5 21.8284 7.5 21C7.5 20.1716 8.17157 19.5 9 19.5ZM20 19.5C20.8284 19.5 21.5 20.1716 21.5 21C21.5 21.8284 20.8284 22.5 20 22.5C19.1716 22.5 18.5 21.8284 18.5 21C18.5 20.1716 19.1716 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </button>
            )}
            <button className="nav-action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="nav-action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="nav-menu-bar">
        <ul className="nav-menu-links">
          <li><a href="#luxury">Luxury</a></li>
          <li><a href="#sets">Sets</a></li>
          <li><a href="#pizza">Pizza</a></li>
          <li><a href="#baked-rolls">Baked rolls</a></li>
          <li><a href="#hot-rolls">Hot rolls</a></li>
          <li><a href="#wok">Wok</a></li>
          <li><a href="#salads">Salads</a></li>
          <li><a href="#soups">Soups</a></li>
          <li><a href="#drinks">Drinks</a></li>
          <li><a href="#desserts">Desserts</a></li>
        </ul>
      </div>
    </nav>
  )
}

