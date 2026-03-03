import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import { isOwner } from '../utils/auth'

export type UserType = 'owner' | 'client' | null

const DEMO_CREDENTIALS = {
  owner: { email: 'owner@example.com', password: 'testes123456' },
  client: { email: 'client@example.com', password: 'testes123456' }
} as const

export function useLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<UserType>(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { login: authLogin } = useAuth()

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error)
      return
    }

    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      const timer = setTimeout(() => setSuccessMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validar se o tipo de usuário foi selecionado
    if (!userType) {
      setError('Por favor, selecione se você é Proprietário ou Cliente.')
      return
    }

    setLoading(true)

    try {
      const result = await authLogin(email, password)

      if (!result.success) {
        const errorMessage = Array.isArray(result.error)
          ? result.error.join(', ')
          : result.error || 'Erro ao fazer login. Tente novamente.'
        console.error('[useLogin] Erro no login:', errorMessage)
        setError(errorMessage)
        setLoading(false)
        return
      }

      const user = result.user
      if (!user) {
        setError('Erro ao obter dados do usuário.')
        setLoading(false)
        return
      }

      const userIsOwner = isOwner(user.role)
      const establishmentCode = user.establishment?.code

      // Verificar se o tipo de usuário selecionado corresponde ao tipo real do usuário
      if (userType) {
        const expectedOwner = userType === 'owner'
        if (userIsOwner !== expectedOwner) {
          const errorMsg = expectedOwner 
            ? 'Este email pertence a um cliente. Por favor, selecione "Cliente" ou use um email de proprietário.'
            : 'Este email pertence a um proprietário. Por favor, selecione "Proprietário" ou use um email de cliente.'
          setError(errorMsg)
          setLoading(false)
          return
        }
      }

      // Redirecionar baseado no tipo de usuário
      if (userIsOwner) {
        setLoading(false)
        if (establishmentCode) {
          navigate(`/establishment/${establishmentCode}`)
        } else {
          navigate('/establishments/new')
        }
        return
      }

      // Cliente
      setLoading(false)
      
      // Usar requestAnimationFrame para garantir que o estado seja atualizado antes do redirecionamento
      requestAnimationFrame(() => {
        if (establishmentCode) {
          navigate(`/menu/${establishmentCode}`, { replace: true })
        } else {
          navigate('/restaurants', { replace: true })
        }
      })
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
      console.error('Erro no login:', err)
      setLoading(false)
    }
  }

  const handleDemoAccess = async (type: Exclude<UserType, null>) => {
    setError('')
    setLoading(true)

    try {
      const credentials = DEMO_CREDENTIALS[type]
      const result = await authLogin(credentials.email, credentials.password)

      if (!result.success) {
        const errorMessage = Array.isArray(result.error)
          ? result.error.join(', ')
          : result.error || 'Erro ao entrar no modo demo.'
        setError(errorMessage)
        setLoading(false)
        return
      }

      const user = result.user
      if (!user) {
        setError('Erro ao obter dados do usuário demo.')
        setLoading(false)
        return
      }

      const userIsOwner = isOwner(user.role)
      const establishmentCode = user.establishment?.code
      const expectedOwner = type === 'owner'

      if (userIsOwner !== expectedOwner) {
        setError('A conta demo não corresponde ao tipo selecionado.')
        setLoading(false)
        return
      }

      if (userIsOwner) {
        setLoading(false)
        if (establishmentCode) {
          navigate(`/establishment/${establishmentCode}`)
        } else {
          navigate('/establishments/new')
        }
        return
      }

      setLoading(false)
      requestAnimationFrame(() => {
        if (establishmentCode) {
          navigate(`/menu/${establishmentCode}`, { replace: true })
        } else {
          navigate('/restaurants', { replace: true })
        }
      })
    } catch (err) {
      setError('Erro ao entrar no modo demo.')
      console.error('Erro no acesso demo:', err)
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    userType,
    setUserType,
    error,
    successMessage,
    loading,
    handleSubmit,
    handleDemoAccess
  }
}
