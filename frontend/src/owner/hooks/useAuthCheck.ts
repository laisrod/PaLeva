import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Hook para verificar autenticação e redirecionar se necessário
 * Retorna true se autenticado, false caso contrário
 */
export function useAuthCheck(redirectPath: string = '/login'): boolean {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate(redirectPath)
    }
  }, [navigate, redirectPath])

  const token = localStorage.getItem('auth_token')
  return !!token
}
