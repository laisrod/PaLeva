import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { firebaseAuth } from '../services/firebaseAuth'

/**
 * Hook para verificar autenticação e redirecionar se não autenticado
 */
export function useRequireAuth() {
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const user = firebaseAuth.getCurrentUser()
      if (!user) {
        navigate('/login')
      }
    }
    
    checkAuth()
  }, [navigate])
}

