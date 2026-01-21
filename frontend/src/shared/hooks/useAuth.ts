import { useState, useEffect, useCallback, useRef } from 'react'
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
  
  // Flag para evitar múltiplas chamadas simultâneas
  const syncingRef = useRef(false)

  /**
   * Sincroniza dados do usuário com o backend usando token do Firebase
   * Obtém os dados do usuário (role, establishment) do backend Rails
   */
  const syncUserFromBackend = useCallback(async (): Promise<User | null> => {
    // Evitar múltiplas chamadas simultâneas
    if (syncingRef.current) {
      console.warn('syncUserFromBackend: Já está sincronizando, ignorando chamada duplicada')
      return null
    }
    
    syncingRef.current = true
    
    try {
      const firebaseToken = await firebaseAuth.getIdToken()
      
      if (!firebaseToken) {
        console.warn('syncUserFromBackend: Token do Firebase não disponível')
        return null
      }

      // Definir cookie para requisições HTML (fazer silenciosamente, não bloquear se falhar)
      api.setCookie(firebaseToken).catch(err => {
        console.warn('Erro ao definir cookie (não crítico):', err)
      })
      
      // Usar o token do Firebase para autenticar no backend com timeout de 5 segundos
      const apiCall = api.isSignedIn(firebaseToken)
      const timeoutPromise = new Promise<{ data?: any; error?: string }>((resolve) => {
        setTimeout(() => {
          console.warn('syncUserFromBackend: Timeout após 5 segundos - backend não respondeu')
          resolve({ error: 'Timeout' })
        }, 5000)
      })
      
      const response = await Promise.race([apiCall, timeoutPromise])
      
      if (response.error || !response) {
        console.warn('syncUserFromBackend: Resposta vazia, erro ou timeout', response)
        return null
      }
      
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
        
        console.log('syncUserFromBackend: Usuário sincronizado com sucesso', backendUser)
        return backendUser
      }
      
      console.warn('syncUserFromBackend: Usuário não autenticado no backend')
      return null
    } catch (error) {
      console.error('Erro ao sincronizar usuário:', error)
      return null
    } finally {
      syncingRef.current = false
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
    let resolved = false
    
    // Verificação inicial imediata
    const checkInitialAuth = async () => {
      const firebaseUser = firebaseAuth.getCurrentUser()
      
      if (firebaseUser && !resolved) {
        resolved = true
        try {
          const backendUser = await syncUserFromBackend()
          
          if (!mounted) return
          
          if (backendUser) {
            setUser(backendUser)
            setIsAuthenticated(true)
          } else {
            setUser({
              id: parseInt(firebaseUser.uid) || 0,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              role: true,
            })
            setIsAuthenticated(true)
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação inicial:', error)
          if (mounted) {
            setUser({
              id: parseInt(firebaseUser.uid) || 0,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              role: true,
            })
            setIsAuthenticated(true)
          }
        } finally {
          if (mounted) {
            setLoading(false)
          }
        }
      } else if (!firebaseUser && !resolved) {
        resolved = true
        if (mounted) {
          clearAuthStorage()
          setUser(null)
          setIsAuthenticated(false)
          setLoading(false)
        }
      }
    }
    
    // Executar verificação inicial
    checkInitialAuth()
    
    // Timeout de segurança para garantir que loading seja false
    const timeout = setTimeout(() => {
      if (mounted && !resolved) {
        console.warn('Timeout na verificação de autenticação, definindo loading como false')
        resolved = true
        setLoading(false)
      }
    }, 1000) // Reduzido para 1 segundo para carregar mais rápido
    
    const unsubscribe = firebaseAuth.onAuthStateChange(async (firebaseUser) => {
      if (!mounted) return
      
      // Se já foi resolvido na verificação inicial, apenas atualizar se necessário
      if (resolved && !firebaseUser) {
        clearAuthStorage()
        setUser(null)
        setIsAuthenticated(false)
        return
      }
      
      if (resolved && firebaseUser) {
        // Apenas atualizar se necessário
        return
      }
      
      resolved = true
      
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
      clearTimeout(timeout)
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
    console.log('Login: Iniciando autenticação para', email)
    
    // Autenticar no Firebase
    const firebaseResult = await firebaseAuth.signIn(email, password)
    
    if (!firebaseResult.success || !firebaseResult.user) {
      console.error('Login: Falha no Firebase', firebaseResult.error)
      return { success: false, error: firebaseResult.error }
    }

    console.log('Login: Firebase autenticado com sucesso')

    // Sincronizar com backend usando token do Firebase (com timeout)
    console.log('Login: Sincronizando com backend...')
    const backendUser = await syncUserFromBackend()
    
    // Definir cookie para requisições HTML (não bloquear se falhar)
    const firebaseToken = await firebaseAuth.getIdToken()
    if (firebaseToken) {
      api.setCookie(firebaseToken).catch(err => {
        console.warn('Login: Erro ao definir cookie (não crítico):', err)
      })
    }
    
    if (backendUser) {
      console.log('Login: Usuário sincronizado do backend', backendUser)
      setUser(backendUser)
      setIsAuthenticated(true)
      return { success: true, user: backendUser }
    }
    
    // Fallback: usar dados do Firebase se backend não responder
    console.warn('Login: Backend não respondeu, usando dados do Firebase como fallback')
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

