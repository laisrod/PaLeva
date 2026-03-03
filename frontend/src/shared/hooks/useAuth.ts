import { createContext, createElement, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'
import {
  User,
  isOwner,
  isClient,
  saveUserData,
  clearAuthStorage,
  getStoredUserData
} from '../utils/auth'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isOwner: boolean
  isClient: boolean
  login: (email: string, password: string) => Promise<{
    success: boolean
    user?: User
    error?: string | string[]
  }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  refreshUser: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function useProvideAuth(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
          role: response.data.user.role === true,
          establishment: response.data.user.establishment,
        }

        saveUserData(backendUser)
        return backendUser
      }

      return null
    } catch (error) {
      console.error('Erro ao sincronizar usuário:', error)
      return null
    }
  }, [])

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('auth_token')

    if (!token) {
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

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
  }, [syncUserFromBackend])

  useEffect(() => {
    const storedUser = getStoredUserData()
    if (storedUser) {
      setUser(storedUser)
      setIsAuthenticated(true)
    }

    checkAuth()
  }, [checkAuth])

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
        role: response.data.user.role === true,
        establishment: response.data.user.establishment,
      }

      saveUserData(userData)
      setUser(userData)
      setIsAuthenticated(true)

      return { success: true, user: userData }
    }

    const errorMessage = response.error || response.message || 'Email ou senha inválidos'
    return { success: false, error: errorMessage }
  }, [])

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useProvideAuth()
  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
