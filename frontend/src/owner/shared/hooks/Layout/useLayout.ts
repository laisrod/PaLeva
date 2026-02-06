import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../../shared/hooks/useAuth'

// gerencia lógica de navegação, autenticação e estado do layout
export function useLayout() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const establishmentCode = user?.establishment?.code || localStorage.getItem('establishment_code')

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname.includes(path)
  }

  const handleNavigateToProfile = () => {
    navigate('/profile')
  }

  return {
    isAuthenticated,
    user,
    establishmentCode,
    handleLogout,
    isActive,
    handleNavigateToProfile
  }
}
