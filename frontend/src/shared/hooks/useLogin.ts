import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import { isOwner } from '../utils/auth'

export function useLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    setLoading(true)

    try {
      const result = await authLogin(email, password)

      if (!result.success) {
        const errorMessage = Array.isArray(result.error)
          ? result.error.join(', ')
          : result.error || 'Erro ao fazer login. Tente novamente.'
        setError(errorMessage)
        return
      }

      const user = result.user
      if (!user) {
        setError('Erro ao obter dados do usuário.')
        return
      }

      const userIsOwner = isOwner(user.role)
      const establishmentCode = user.establishment?.code

      if (userIsOwner) {
        if (establishmentCode) {
          navigate(`/establishment/${establishmentCode}`)
        } else {
          navigate('/establishments/new')
        }
        return
      }

      if (establishmentCode) {
        navigate(`/menu/${establishmentCode}`)
      } else {
        navigate('/restaurants')
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
      console.error('Erro no login:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    successMessage,
    loading,
    handleSubmit,
  }
}
