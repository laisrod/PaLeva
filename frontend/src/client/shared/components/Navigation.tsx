import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks/useAuth'
import { NavigationProps } from '../types/navigation'
import { APP_CONFIG } from '../constants/appConstants'
import '../../../css/client/components/Navigation.css'

export default function Navigation({
}: NavigationProps) {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navigation">
      <div className="nav-top-bar">
        <div className="nav-top-left">
          <button className="nav-back-establishments-btn" onClick={() => navigate('/restaurants')}>
            Voltar aos estabelecimentos
          </button>
        </div>
        <div className="nav-top-right">
          <div className="order-info">
            <span className="order-time">{APP_CONFIG.ORDER_HOURS.DISPLAY}</span>
            <span className="order-phone">{APP_CONFIG.CONTACT.PHONE}</span>
            <span className="order-phone-label">{APP_CONFIG.CONTACT.PHONE_LABEL}</span>
          </div>
          <div className="nav-actions">
            {isAuthenticated && (
              <button className="nav-action-btn nav-action-btn-logout" onClick={handleLogout} title="Sair">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Menu categories serão exibidas dinamicamente na página do menu */}
    </nav>
  )
}

