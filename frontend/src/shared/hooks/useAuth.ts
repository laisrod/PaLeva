import { useState, useEffect, useCallback } from 'react'
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
   * Sincroniza dados do usuário com o backend
   * Sempre busca dados atualizados do servidor
   */
  const syncUserFromBackend = useCallback(async (): Promise<User | null> => {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      return null
    }

    try {
      const response = await api.isSignedIn()
      
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
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

    // Sempre sincronizar com backend
    const backendUser = await syncUserFromBackend()
    
    if (backendUser) {
      setUser(backendUser)
      setIsAuthenticated(true)
    } else {
      // Token inválido ou expirado
      clearAuthStorage()
      setUser(null)
      setIsAuthenticated(false)
    }
    
    setLoading(false)
  }, [syncUserFromBackend])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  /**
   * Faz login e sincroniza dados do usuário
   */
  const login = useCallback(async (email: string, password: string): Promise<{
    success: boolean
    user?: User
    error?: string | string[]
  }> => {
    const response = await api.signIn(email, password)
    
    if (response.data && response.data.user) {
      const userData: User = {
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role === true, // Garantir boolean
        establishment: response.data.user.establishment,
      }
      
      // Salvar dados no localStorage
      saveUserData(userData)
      
      // Atualizar estado
      setUser(userData)
      setIsAuthenticated(true)
      
      return { success: true, user: userData }
    }
    
    // Retornar erro com mensagem padrão se não houver mensagem específica
    const errorMessage = response.error || response.message || 'Email ou senha inválidos'
    return { success: false, error: errorMessage }
  }, [])

  /**
   * Faz logout e limpa dados
   */
  const logout = useCallback(async () => {
    try {
      await api.signOut()
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
    const backendUser = await syncUserFromBackend()
    
    if (backendUser) {
      setUser(backendUser)
      setIsAuthenticated(true)
    } else {
      clearAuthStorage()
      setUser(null)
      setIsAuthenticated(false)
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

