import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/hooks/useAuth'

export function useRequireNewEstablishment() {
  const navigate = useNavigate()
  const { user, loading, isAuthenticated, isOwner } = useAuth()
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    // Timeout de segurança: se loading demorar mais de 1 segundo, permitir renderização
    // Isso garante que a página carregue mesmo se o backend estiver lento
    const timeout = setTimeout(() => {
      console.warn('useRequireNewEstablishment: Timeout - permitindo renderização mesmo com loading')
      setLocalLoading(false)
    }, 1000)

    if (!loading) {
      clearTimeout(timeout)
      setLocalLoading(false)
      
      // Verificar autenticação apenas se não estiver mais carregando
      if (!isAuthenticated || !user) {
        navigate('/login', { replace: true })
        return
      }

      const establishmentCode = user.establishment?.code

      if (isOwner && establishmentCode) {
        navigate(`/establishment/${establishmentCode}/menus`, { replace: true })
        return
      }

      if (!isOwner) {
        if (establishmentCode) {
          navigate(`/menu/${establishmentCode}`, { replace: true })
        } else {
          navigate('/restaurants', { replace: true })
        }
        return
      }
    }

    return () => clearTimeout(timeout)
  }, [navigate, user, loading, isAuthenticated, isOwner])

  // Retornar false se já passou o timeout, mesmo que loading seja true
  return { loading: localLoading && loading }
}
