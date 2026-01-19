import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { firebaseAuth } from '../../shared/services/firebaseAuth'

/**
 * Hook para verificar autenticação e redirecionar se necessário
 * Retorna true se autenticado, false caso contrário
 */
export function useAuthCheck(redirectPath: string = '/login'): boolean {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const user = firebaseAuth.getCurrentUser()
      if (!user) {
        navigate(redirectPath)
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
      }
    }
    
    checkAuth()
  }, [navigate, redirectPath])

  return isAuthenticated
}
