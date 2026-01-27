import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../shared/hooks/useAuth'

export function useRequireNewEstablishment() {
  const navigate = useNavigate()
  const { user, loading, isAuthenticated, isOwner } = useAuth()

  useEffect(() => {
    if (loading) {
      return
    }

    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }

    const establishmentCode = user.establishment?.code

    if (isOwner && establishmentCode) {
      navigate(`/establishment/${establishmentCode}/menus`)
      return
    }

    if (!isOwner) {
      if (establishmentCode) {
        navigate(`/menu/${establishmentCode}`)
      } else {
        navigate('/restaurants')
      }
      return
    }
  }, [navigate, user, loading, isAuthenticated, isOwner])

  return { loading }
}
