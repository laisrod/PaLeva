import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../shared/hooks/useAuth'
import { useRestaurants } from './useRestaurants'

export function useRestaurantsList() {
  const navigate = useNavigate()
  const { user, loading: authLoading, isAuthenticated, isOwner } = useAuth()
  const { restaurants, loading, error } = useRestaurants()

  useEffect(() => {
    if (authLoading) return

    // Visitantes e clientes podem acessar a lista livremente (modo demo).
    // Apenas proprietário autenticado vai para a área de gestão.
    if (isAuthenticated && user && isOwner) {
      const establishmentCode = user.establishment?.code
      if (establishmentCode) {
        navigate(`/establishment/${establishmentCode}/menus`)
      } else {
        navigate('/establishments/new')
      }
    }
  }, [navigate, user, authLoading, isAuthenticated, isOwner])

  const handleSelectRestaurant = (code: string) => {
    navigate(`/menu/${code}`)
  }

  return {
    restaurants,
    loading,
    error,
    authLoading,
    handleSelectRestaurant
  }
}
