import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { oauthService, OAuthResponse } from '../services/oauth'
import { useAuth } from './useAuth'
import { isOwner, saveUserData } from '../utils/auth'

export function useOAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { refreshUser } = useAuth()

  const loginWithGoogle = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      oauthService.initiateGoogleLogin()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao iniciar login com Google'
      setError(errorMessage)
      setLoading(false)
    }
  }, [])

  const handleOAuthCallback = useCallback(async (code: string) => {
    // Este método não é mais usado
    // O callback é processado diretamente pelo OAuthCallback component
    console.warn('handleOAuthCallback não é mais necessário - use OAuthCallback component')
  }, [])

  return {
    loginWithGoogle,
    handleOAuthCallback,
    loading,
    error,
  }
}
