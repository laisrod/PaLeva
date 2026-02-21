const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

export interface OAuthUser {
  id: number
  email: string
  name: string
  last_name: string
  role: boolean
  provider?: string
  has_establishment: boolean
  establishment_code?: string
}

export interface OAuthResponse {
  token: string
  user: OAuthUser
  message?: string
}

class OAuthService {
  /**
   * Inicia o fluxo OAuth redirecionando para o backend
   */
  initiateGoogleLogin(): void {
    const callbackUrl = encodeURIComponent(
      `${window.location.origin}/auth/callback`
    )
    const oauthUrl = `${API_BASE_URL}/login/google?redirect_uri=${callbackUrl}`
    
    window.location.href = oauthUrl
  }

  // Nota: O callback é processado diretamente pelo backend
  // que redireciona para /auth/callback com token e user na URL
  // Este método não é mais necessário
}

export const oauthService = new OAuthService()
