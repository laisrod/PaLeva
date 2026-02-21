import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { isOwner, saveUserData } from '../utils/auth'

export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    const userParam = searchParams.get('user')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      navigate('/login', {
        state: { error: decodeURIComponent(errorParam) },
        replace: true
      })
      return
    }

    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam))
        
        // Salvar token e dados do usuário
        localStorage.setItem('auth_token', decodeURIComponent(token))
        localStorage.setItem('user', JSON.stringify(userData))
        
        // Salvar dados usando utilitário
        saveUserData({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role === true,
          establishment: userData.establishment_code ? {
            id: 0, // Será atualizado pelo backend
            code: userData.establishment_code,
            name: '', // Será atualizado pelo backend
          } : undefined,
        })
        
        // Atualizar estado do auth
        refreshUser().then(() => {
          // Redirecionar baseado no role e establishment
          const userIsOwner = isOwner(userData.role)
          const establishmentCode = userData.establishment_code

          if (userIsOwner) {
            if (establishmentCode) {
              navigate(`/establishment/${establishmentCode}`, { replace: true })
            } else {
              navigate('/establishments/new', { replace: true })
            }
          } else {
            if (establishmentCode) {
              navigate(`/menu/${establishmentCode}`, { replace: true })
            } else {
              navigate('/restaurants', { replace: true })
            }
          }
        })
      } catch (err) {
        console.error('[OAuthCallback] Erro ao processar dados:', err)
        navigate('/login', {
          state: { error: 'Erro ao processar autenticação OAuth' },
          replace: true
        })
      }
    } else {
      navigate('/login', {
        state: { error: 'Dados de autenticação não encontrados' },
        replace: true
      })
    }
  }, [searchParams, navigate, refreshUser])


  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <p>Processando autenticação...</p>
    </div>
  )
}
