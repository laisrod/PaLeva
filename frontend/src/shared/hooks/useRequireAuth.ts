import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

/**
 * Hook para verificar autenticação e redirecionar se não autenticado
 * Usa o hook useAuth para verificar o estado de autenticação
 */
export function useRequireAuth() {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    // Aguardar verificação de autenticação
    if (loading) {
      return
    }

    // Se não estiver autenticado, redirecionar para login
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [navigate, isAuthenticated, loading])
}

