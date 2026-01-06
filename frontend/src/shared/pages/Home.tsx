import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const navigate = useNavigate()
  const { user, loading, isAuthenticated, isOwner, isClient } = useAuth()

  useEffect(() => {
    if (loading) {
      return // Aguardar verificação de autenticação
    }

    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }

    const establishmentCode = user.establishment?.code

    // PRIORIDADE 1: Proprietário
    if (isOwner) {
      if (establishmentCode) {
        navigate(`/establishment/${establishmentCode}/menus`)
      } else {
        navigate('/establishments/new')
      }
      return
    }

    // PRIORIDADE 2: Cliente
    if (isClient) {
      if (establishmentCode) {
        navigate(`/menu/${establishmentCode}`)
      } else {
        navigate('/restaurants')
      }
      return
    }

    // FALLBACK: Se tiver estabelecimento mas role indefinido, assume proprietário
    if (establishmentCode) {
      navigate(`/establishment/${establishmentCode}/menus`)
    } else {
      navigate('/restaurants')
    }
  }, [navigate, user, loading, isAuthenticated, isOwner, isClient])

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Redirecionando...</p>
    </div>
  )
}

