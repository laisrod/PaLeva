import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import { isOwner } from '../utils/auth'

export type UserType = 'owner' | 'client' | null

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
      console.log('[useLogin] Iniciando login...', { email, userType })
      const result = await authLogin(email, password)
      console.log('[useLogin] Resultado do login:', { success: result.success, hasUser: !!result.user })

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
        console.error('[useLogin] Usuário não encontrado no resultado')
        setError('Erro ao obter dados do usuário.')
        setLoading(false)
        return
      }

      const userIsOwner = isOwner(user.role)
      const establishmentCode = user.establishment?.code
      console.log('[useLogin] Dados do usuário:', { 
        userIsOwner, 
        role: user.role, 
        establishmentCode,
        userType 
      })

      // Verificar se o tipo de usuário selecionado corresponde ao tipo real do usuário
      if (userType) {
        const expectedOwner = userType === 'owner'
        if (userIsOwner !== expectedOwner) {
          const errorMsg = expectedOwner 
            ? 'Este email pertence a um cliente. Por favor, selecione "Cliente" ou use um email de proprietário.'
            : 'Este email pertence a um proprietário. Por favor, selecione "Proprietário" ou use um email de cliente.'
          console.error('[useLogin] Tipo de usuário não corresponde:', errorMsg)
          setError(errorMsg)
          setLoading(false)
          return
        }
      }

      // Redirecionar baseado no tipo de usuário
      if (userIsOwner) {
        console.log('[useLogin] Redirecionando proprietário...')
        setLoading(false)
        if (establishmentCode) {
          navigate(`/establishment/${establishmentCode}`)
        } else {
          navigate('/establishments/new')
        }
        return
      }

      // Cliente
      console.log('[useLogin] Redirecionando cliente...', { establishmentCode })
      setLoading(false)
      
      // Usar requestAnimationFrame para garantir que o estado seja atualizado antes do redirecionamento
      requestAnimationFrame(() => {
        if (establishmentCode) {
          console.log('[useLogin] Navegando para /menu/' + establishmentCode)
          navigate(`/menu/${establishmentCode}`, { replace: true })
        } else {
          console.log('[useLogin] Navegando para /restaurants')
          navigate('/restaurants', { replace: true })
        }
      })
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
      console.error('Erro no login:', err)
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
  }
}
