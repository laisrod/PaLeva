import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Hook para verificar autenticação e redirecionar se não autenticado
 */
export function useRequireAuth() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])
}

