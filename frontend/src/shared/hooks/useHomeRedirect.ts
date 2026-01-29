import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export function useHomeRedirect() {
  const navigate = useNavigate()
  const { user, loading, isAuthenticated, isOwner, isClient } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }

    const establishmentCode = user.establishment?.code

    if (isOwner) {
      if (establishmentCode) {
        navigate(`/establishment/${establishmentCode}`)
      } else {
        navigate('/establishments/new')
      }
      return
    }

    if (isClient) {
      if (establishmentCode) {
        navigate(`/menu/${establishmentCode}`)
      } else {
        navigate('/restaurants')
      }
      return
    }

    if (establishmentCode) {
      navigate(`/establishment/${establishmentCode}`)
    } else {
      navigate('/restaurants')
    }
  }, [navigate, user, loading, isAuthenticated, isOwner, isClient])
}
