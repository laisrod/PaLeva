import { Link } from 'react-router-dom'
import { useLayout } from '../../hooks/Layout/useLayout'
import { LayoutProps } from '../../types/layout'
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

      {/* Navbar Principal */}
      <nav className="owner-navbar">
        <div className="owner-nav-top">
          <div className="owner-nav-left">
            <Link className="owner-logo" to={establishmentCode ? `/establishment/${establishmentCode}` : '/'}>
              <span className="logo-text">PaLeva</span>
            </Link>
            
            {establishmentCode && (
              <div className="owner-nav-links">
                <Link
                  to={`/establishment/${establishmentCode}`}
                  className={`owner-nav-link ${isActive(`/establishment/${establishmentCode}`) && !isActive('/menus') && !isActive('/dishes') && !isActive('/drinks') && !isActive('/orders') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link
                  to={`/establishment/${establishmentCode}/menus`}
                  className={`owner-nav-link ${isActive('/menus') ? 'active' : ''}`}
                >
                  Cardápios
                </Link>
                <Link
                  to={`/establishment/${establishmentCode}/dishes`}
                  className={`owner-nav-link ${isActive('/dishes') ? 'active' : ''}`}
                >
                  Pratos
                </Link>
                <Link
                  to={`/establishment/${establishmentCode}/drinks`}
                  className={`owner-nav-link ${isActive('/drinks') ? 'active' : ''}`}
                >
                  Bebidas
                </Link>
                <Link
                  to={`/establishment/${establishmentCode}/orders`}
                  className={`owner-nav-link ${isActive('/orders') ? 'active' : ''}`}
                >
                  Pedidos
                </Link>
              </div>
            )}
          </div>

          <div className="owner-nav-right">
            <div className="owner-nav-info">
              <span className="owner-nav-time">Atendimento: 11:00 às 23:00</span>
              {user?.establishment?.phone_number && (
                <span className="owner-nav-phone">{user.establishment.phone_number}</span>
              )}
            </div>

            <div className="owner-nav-actions">
              {isAuthenticated && user && establishmentCode ? (
                <>
                  <button
                    onClick={handleNavigateToProfile}
                    className="owner-action-btn owner-user-btn"
                    title={user.email}
                  >
                    <span className="owner-icon">👤</span>
                    Conta
                  </button>
                  <button
                    onClick={handleLogout}
                    className="owner-action-btn owner-logout-btn"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="owner-action-btn"
                  >
                    Entrar
                  </Link>
                  <Link to="/register" className="owner-action-btn owner-primary-btn">
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

