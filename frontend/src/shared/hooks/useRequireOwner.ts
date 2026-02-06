import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

/**
 * Hook que garante que o usuário está autenticado E é owner
 * Redireciona para /login se não autenticado
 * Redireciona para /restaurants se for cliente
 */
export function useRequireOwner() {
  const navigate = useNavigate()
  const { user, loading, isAuthenticated, isOwner } = useAuth()

  useEffect(() => {
    if (loading) {
      return // Aguardar verificação de autenticação
    }

    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }

    if (!isOwner) {
      // Se for cliente, redirecionar para lista de restaurantes
      navigate('/restaurants')
      return
    }
  }, [navigate, user, loading, isAuthenticated, isOwner])
}
