import { useState, useEffect, useCallback } from 'react'
import { firebaseAuth } from '../services/firebaseAuth'
import { api } from '../services/api'
import { 
  User, 
  isOwner, 
  isClient, 
  saveUserData, 
  clearAuthStorage,
  getStoredUserData 
} from '../utils/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  /**
   * Sincroniza dados do usuário com o backend usando token do Firebase
   * Obtém os dados do usuário (role, establishment) do backend Rails
   */
  const syncUserFromBackend = useCallback(async (): Promise<User | null> => {
    const firebaseToken = await firebaseAuth.getIdToken()
    
    if (!firebaseToken) {
      return null
    }

    try {
      // Definir cookie para requisições HTML (fazer silenciosamente, não bloquear se falhar)
      api.setCookie(firebaseToken).catch(err => {
        console.warn('Erro ao definir cookie (não crítico):', err)
      })
      
      // Usar o token do Firebase para autenticar no backend
      const response = await api.isSignedIn(firebaseToken)
      
      if (response.data?.signed_in && response.data.user) {
        const backendUser: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role === true, // Garantir boolean
          establishment: response.data.user.establishment,
        }
        
        // Salvar dados atualizados no localStorage
        saveUserData(backendUser)
        
        return backendUser
      }
      
      return null
    } catch (error) {
      console.error('Erro ao sincronizar usuário:', error)
      return null
    }
  }, [])

  /**
   * Verifica autenticação e sincroniza dados do usuário
   */
  const checkAuth = useCallback(async () => {
    const firebaseUser = firebaseAuth.getCurrentUser()
    
    if (!firebaseUser) {
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

    // Sincronizar dados do backend
    const backendUser = await syncUserFromBackend()
    
    if (backendUser) {
      setUser(backendUser)
      setIsAuthenticated(true)
    } else {
      // Não conseguiu obter dados do backend, mas Firebase está autenticado
      // Criar usuário básico do Firebase como fallback
      setUser({
        id: parseInt(firebaseUser.uid) || 0,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: true, // Default para owner
      })
      setIsAuthenticated(true)
    }
    
    setLoading(false)
  }, [syncUserFromBackend])

  // Observar mudanças no estado de autenticação do Firebase
  useEffect(() => {
    let mounted = true
    
    const unsubscribe = firebaseAuth.onAuthStateChange(async (firebaseUser) => {
      if (!mounted) return
      
      try {
        if (firebaseUser) {
          // Usuário autenticado no Firebase, buscar dados do backend
          const backendUser = await syncUserFromBackend()
          
          if (!mounted) return
          
          if (backendUser) {
            setUser(backendUser)
            setIsAuthenticated(true)
          } else {
            // Fallback para dados do Firebase
            setUser({
              id: parseInt(firebaseUser.uid) || 0,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              role: true,
            })
            setIsAuthenticated(true)
          }
        } else {
          // Usuário não autenticado
          clearAuthStorage()
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        if (mounted) {
          clearAuthStorage()
          setUser(null)
          setIsAuthenticated(false)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [syncUserFromBackend])

  /**
   * Faz login usando Firebase Auth e sincroniza dados do usuário
   */
  const login = useCallback(async (email: string, password: string): Promise<{
    success: boolean
    user?: User
    error?: string | string[]
  }> => {
    // Autenticar no Firebase
    const firebaseResult = await firebaseAuth.signIn(email, password)
    
    if (!firebaseResult.success || !firebaseResult.user) {
      return { success: false, error: firebaseResult.error }
    }

    // Sincronizar com backend usando token do Firebase
    const backendUser = await syncUserFromBackend()
    
    // Definir cookie para requisições HTML
    const firebaseToken = await firebaseAuth.getIdToken()
    if (firebaseToken) {
      await api.setCookie(firebaseToken)
    }
    
    if (backendUser) {
      setUser(backendUser)
      setIsAuthenticated(true)
      return { success: true, user: backendUser }
    }
    
    // Fallback: usar dados do Firebase se backend não responder
    const firebaseUserData: User = {
      id: parseInt(firebaseResult.user.uid) || 0,
      email: firebaseResult.user.email || email,
      name: firebaseResult.user.displayName || '',
      role: true, // Default
    }
    
    setUser(firebaseUserData)
    setIsAuthenticated(true)
    
    return { success: true, user: firebaseUserData }
  }, [syncUserFromBackend])

  /**
   * Faz logout no Firebase e limpa dados
   */
  const logout = useCallback(async () => {
    try {
      await firebaseAuth.signOut()
      // Limpar cookie no backend
      await api.clearCookie()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      clearAuthStorage()
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  /**
   * Força sincronização com backend (útil após mudanças no servidor)
   */
  const refreshUser = useCallback(async () => {
    setLoading(true)
    
    // Verificar se ainda está autenticado no Firebase
    const firebaseUser = firebaseAuth.getCurrentUser()
    if (!firebaseUser) {
      clearAuthStorage()
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      return null
    }
    
    // Forçar refresh do token
    await firebaseAuth.getIdTokenForceRefresh()
    
    const backendUser = await syncUserFromBackend()
    
    if (backendUser) {
      setUser(backendUser)
      setIsAuthenticated(true)
    } else {
      // Fallback para dados do Firebase
      setUser({
        id: parseInt(firebaseUser.uid) || 0,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: true,
      })
      setIsAuthenticated(true)
    }
    
    setLoading(false)
    return backendUser
  }, [syncUserFromBackend])

  return {
    user,
    loading,
    isAuthenticated,
    isOwner: user ? isOwner(user.role) : false,
    isClient: user ? isClient(user.role) : false,
    login,
    logout,
    checkAuth,
    refreshUser,
  }
}

