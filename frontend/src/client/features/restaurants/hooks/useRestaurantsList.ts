import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../shared/hooks/useAuth'
import { useRestaurants } from './useRestaurants'

export function useRestaurantsList() {
  const navigate = useNavigate()
  const { user, loading: authLoading, isAuthenticated, isOwner, isClient } = useAuth()
  const { restaurants, loading, error } = useRestaurants()

  useEffect(() => {
    if (authLoading) {
      return // Aguardar verificação de autenticação
    }

    // Verificar autenticação
    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }

    // Verificar se é proprietário - redirecionar para gestão
    if (isOwner) {
      const establishmentCode = user.establishment?.code
      if (establishmentCode) {
        navigate(`/establishment/${establishmentCode}/menus`)
      } else {
        navigate('/establishments/new')
      }
      return
    }

    if (!isClient) {
      navigate('/login')
      return
    }
  }, [navigate, user, authLoading, isAuthenticated, isOwner, isClient])

  const handleSelectRestaurant = (code: string) => {
    navigate(`/menu/${code}`)
  }

  const handleCreateEstablishment = () => {
    navigate('/establishments/new')
  }

  return {
    restaurants,
    loading,
    error,
    authLoading,
    handleSelectRestaurant,
    handleCreateEstablishment
  }
}
