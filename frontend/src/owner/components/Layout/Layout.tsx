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
                  className={`owner-nav-link ${isActive('/orders') ? 'active' : ''}`}
                  title="Pedidos"
                >
                  <img src={OrdersIcon} alt="Pedidos" className="nav-icon" />
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

