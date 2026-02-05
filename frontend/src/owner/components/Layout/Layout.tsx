import { Link } from 'react-router-dom'
import { useLayout } from '../../hooks/Layout/useLayout'
import { LayoutProps } from '../../types/layout'
import RestaurantIcon from '../../../assets/restaurant.svg'
import MenuIcon from '../../../assets/menu.svg'
import DishIcon from '../../../assets/dish.svg'
import DrinkIcon from '../../../assets/drink.svg'
import OrdersIcon from '../../../assets/orders.svg'
import ClockIcon from '../../../assets/clock.svg'
import UserIcon from '../../../assets/user.svg'
import LogoutIcon from '../../../assets/logout.svg'
import '../../../css/owner/Layout.css'

export default function Layout({ children }: LayoutProps) {
  const {
    isAuthenticated,
    user,
    establishmentCode,
    handleLogout,
    isActive,
    handleNavigateToProfile
  } = useLayout()

  return (
    <div className="layout">
      {/* Header Superior - Informações do Estabelecimento */}
      <header className="owner-header">
        {user?.establishment && (
          <div className="owner-header-subtitle">
            <p>{user.establishment.name} - Gestão de Estabelecimento</p>
          </div>
        )}
      </header>

      {/* Sidebar Vertical */}
      <nav className="owner-navbar">
        <div className="owner-nav-top">
          <div className="owner-nav-left">
            <Link className="owner-logo" to={establishmentCode ? `/establishment/${establishmentCode}` : '/'}>
              <span className="logo-text">PÁLEVÁ</span>
            </Link>
            
            {establishmentCode && (
              <div className="owner-nav-links">
                <Link
                  to={`/establishment/${establishmentCode}`}
                  className={`owner-nav-link ${isActive(`/establishment/${establishmentCode}`) && !isActive('/menus') && !isActive('/dishes') && !isActive('/drinks') && !isActive('/orders') ? 'active' : ''}`}
                  title="Dashboard"
                >
                  <img src={RestaurantIcon} alt="Dashboard" className="nav-icon" />
                </Link>
                <Link
                  to={`/establishment/${establishmentCode}/menus`}
                  className={`owner-nav-link ${isActive('/menus') ? 'active' : ''}`}
                  title="Cardápios"
                >
                  <img src={MenuIcon} alt="Cardápios" className="nav-icon" />
                </Link>
                <Link
                  to={`/establishment/${establishmentCode}/dishes`}
                  className={`owner-nav-link ${isActive('/dishes') ? 'active' : ''}`}
                  title="Pratos"
                >
                  <img src={DishIcon} alt="Pratos" className="nav-icon" />
                </Link>
                <Link
                  to={`/establishment/${establishmentCode}/drinks`}
                  className={`owner-nav-link ${isActive('/drinks') ? 'active' : ''}`}
                  title="Bebidas"
                >
                  <img src={DrinkIcon} alt="Bebidas" className="nav-icon" />
                </Link>
                <Link
                  to={`/establishment/${establishmentCode}/orders`}
                  className={`owner-nav-link ${isActive('/orders') && !isActive('/orders/history') ? 'active' : ''}`}
                  title="Pedidos"
                >
                  <img src={OrdersIcon} alt="Pedidos" className="nav-icon" />
                </Link>
                <Link
                  to="/orders/history"
                  className={`owner-nav-link ${isActive('/orders/history') ? 'active' : ''}`}
                  title="Histórico de Pedidos"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-icon">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link
                  to={`/establishment/${establishmentCode}/working-hours`}
                  className={`owner-nav-link ${isActive('/working-hours') ? 'active' : ''}`}
                  title="Horários de Funcionamento"
                >
                  <img src={ClockIcon} alt="Horários" className="nav-icon" />
                </Link>
              </div>
            )}
          </div>

          <div className="owner-nav-right">
            <div className="owner-nav-actions">
              {isAuthenticated && user && establishmentCode ? (
                <>
                  <button
                    onClick={handleNavigateToProfile}
                    className="owner-action-btn owner-user-btn"
                    title={user.email}
                  >
                    <img src={UserIcon} alt="Perfil" className="nav-icon" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="owner-action-btn owner-logout-btn"
                    title="Sair"
                  >
                    <img src={LogoutIcon} alt="Sair" className="nav-icon" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="owner-action-btn"
                    title="Entrar"
                  >
                    🔑
                  </Link>
                  <Link to="/register" className="owner-action-btn owner-primary-btn" title="Criar conta">
                    Criar conta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="owner-main-content">
        {children}
      </main>
    </div>
  )
}

