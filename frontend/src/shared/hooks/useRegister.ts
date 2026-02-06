import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { RegisterFormData, validateRegisterForm } from '../utils/registerValidation'
import { formatCPF } from '../utils/cpfUtils'

export function useRegister() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    last_name: '',
    email: '',
    cpf: '',
    password: '',
    password_confirmation: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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

    const validation = validateRegisterForm(formData)
    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    setLoading(true)

    try {
      const response = await api.signUp(formData)
      
      if (response.error) {
        const errorMessage = Array.isArray(response.error) 
          ? response.error.join(', ') 
          : response.error
        setError(errorMessage)
      } else if (response.data) {
        // Redirecionar para login após cadastro bem-sucedido
        navigate('/login', { 
          state: { message: 'Cadastro realizado com sucesso! Faça login para continuar.' }
        })
      }
    } catch (err) {
      setError('Erro ao realizar cadastro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    error,
    loading,
    handleChange,
    handleCPFChange,
    handleSubmit
  }
}
