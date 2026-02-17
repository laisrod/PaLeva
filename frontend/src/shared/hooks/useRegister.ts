import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from './useAuth'
import { RegisterFormData, validateRegisterForm } from '../utils/registerValidation'
import { formatCPF } from '../utils/cpfUtils'
import { isClient } from '../utils/auth'
import { UserType } from './useLogin'

export function useRegister() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    last_name: '',
    email: '',
    cpf: '',
    password: '',
    password_confirmation: ''
  })
  const [userType, setUserType] = useState<UserType>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setFormData(prev => ({
      ...prev,
      cpf: formatted
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validar se o tipo de usuário foi selecionado
    if (!userType) {
      setError('Por favor, selecione se você é Proprietário ou Cliente.')
      return
    }

    const validation = validateRegisterForm(formData)
    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    setLoading(true)

    try {
      // Preparar dados com role (true = owner, false = client)
      const roleValue = userType === 'owner'
      const registerData = {
        ...formData,
        role: roleValue
      }
      
      console.log('[useRegister] Dados de registro:', {
        userType,
        role: roleValue,
        roleType: typeof roleValue,
        email: formData.email
      })
      
      const response = await api.signUp(registerData)
      
      if (response.error) {
        const errorMessage = Array.isArray(response.error) 
          ? response.error.join(', ') 
          : response.error
        setError(errorMessage)
        return
      }

      if (response.data) {
        const user = response.data.user
        
        console.log('[useRegister] Usuário criado:', {
          id: user?.id,
          email: user?.email,
          role: user?.role,
          roleType: typeof user?.role,
          userType
        })
        
        // Verificar se o usuário é cliente baseado no role selecionado
        if (userType === 'client' || (user && isClient(user.role))) {
          // Clientes são redirecionados para login
          navigate('/login', { 
            state: { message: 'Cadastro realizado com sucesso! Faça login para continuar.' }
          })
          return
        }
        
        // Proprietários fazem login automático
        const loginResult = await login(formData.email, formData.password)
        
        if (loginResult.success && loginResult.user) {
          const establishmentCode = loginResult.user.establishment?.code
          
          // Redirecionar para o dashboard se tiver estabelecimento
          if (establishmentCode) {
            navigate(`/establishment/${establishmentCode}`)
          } else {
            // Se não tiver estabelecimento, redirecionar para criar
            navigate('/establishments/new')
          }
        } else {
          // Se o login automático falhar, redirecionar para login
          navigate('/login', { 
            state: { message: 'Cadastro realizado com sucesso! Faça login para continuar.' }
          })
        }
      }
    } catch (err) {
      setError('Erro ao realizar cadastro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    userType,
    setUserType,
    error,
    loading,
    handleChange,
    handleCPFChange,
    handleSubmit
  }
}
