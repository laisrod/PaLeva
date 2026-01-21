import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../services/api'
import { api } from '../../shared/services/api'
import { firebaseAuth } from '../../shared/services/firebaseAuth'
import { useAuth } from '../../shared/hooks/useAuth'
import { getErrorMessage } from './errorHandler'
import { CreateEstablishmentFormData, EstablishmentData, UseCreateEstablishmentOptions } from '../types/establishment'

export function useCreateEstablishment({ onSuccess }: UseCreateEstablishmentOptions = {}) {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  
  const [formData, setFormData] = useState<CreateEstablishmentFormData>({
    name: '',
    social_name: '',
    cnpj: '',
    full_address: '',
    city: '',
    state: '',
    postal_code: '',
    email: '',
    phone_number: '',
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const user = firebaseAuth.getCurrentUser()
      if (!user) {
        navigate('/login', { replace: true })
        return
      }

      const checkIfUserHasEstablishment = async () => {
        try {
          // Timeout de 3 segundos para não travar
          const timeoutPromise = new Promise<{ data?: any; error?: string }>((resolve) => {
            setTimeout(() => {
              resolve({ error: 'Timeout' })
            }, 3000)
          })
          
          const apiCall = api.isSignedIn()
          const response = await Promise.race([apiCall, timeoutPromise])
          
          if (!response.error && response.data?.signed_in && response.data?.user?.establishment) {
            const establishmentCode = response.data.user.establishment.code
            navigate(`/establishment/${establishmentCode}/menus`, { replace: true })
          }
        } catch (err) {
          // Silenciar erro de verificação - permitir que a página carregue
          console.warn('Erro ao verificar estabelecimento (não crítico):', err)
        }
      }

      checkIfUserHasEstablishment()
    }

    checkAuth()
  }, [navigate])

  const formatCNPJ = useCallback((value: string) => {
    const numbersOnly = value.replace(/\D/g, '')
    
    if (numbersOnly.length <= 14) {
      return numbersOnly
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }
    
    return value
  }, [])

  const formatCEP = useCallback((value: string) => {
    const numbersOnly = value.replace(/\D/g, '')
    
    if (numbersOnly.length <= 8) {
      return numbersOnly.replace(/^(\d{5})(\d)/, '$1-$2')
    }
    
    return value
  }, [])

  const formatPhone = useCallback((value: string) => {
    const numbersOnly = value.replace(/\D/g, '')
    
    if (numbersOnly.length <= 11) {
      return numbersOnly
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
    
    return value
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value
    let formattedValue = fieldValue

    if (fieldName === 'cnpj') {
      formattedValue = formatCNPJ(fieldValue)
    } else if (fieldName === 'postal_code') {
      formattedValue = formatCEP(fieldValue)
    } else if (fieldName === 'phone_number') {
      formattedValue = formatPhone(fieldValue)
    }

    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: formattedValue,
    }))
    
    if (errors.length > 0) {
      setErrors([])
    }
  }, [errors.length, formatCNPJ, formatCEP, formatPhone])

  const validateForm = useCallback((): boolean => {
    const validationErrors: string[] = []

    if (!formData.name.trim()) {
      validationErrors.push('Nome Fantasia é obrigatório')
    }
    
    if (!formData.social_name.trim()) {
      validationErrors.push('Razão Social é obrigatória')
    }
    
    if (!formData.cnpj.trim()) {
      validationErrors.push('CNPJ é obrigatório')
    } else {
      const cnpjNumbersOnly = formData.cnpj.replace(/\D/g, '')
      if (cnpjNumbersOnly.length !== 14) {
        validationErrors.push('CNPJ deve conter 14 dígitos')
      }
    }
    
    if (!formData.full_address.trim()) {
      validationErrors.push('Endereço é obrigatório')
    }
    
    if (!formData.city.trim()) {
      validationErrors.push('Cidade é obrigatória')
    }
    
    if (!formData.state.trim()) {
      validationErrors.push('Estado é obrigatório')
    } else if (formData.state.length !== 2) {
      validationErrors.push('Estado deve ter 2 caracteres (ex: SP, RJ)')
    }
    
    if (!formData.postal_code.trim()) {
      validationErrors.push('CEP é obrigatório')
    } else {
      const cepNumbersOnly = formData.postal_code.replace(/\D/g, '')
      if (cepNumbersOnly.length !== 8) {
        validationErrors.push('CEP deve conter 8 dígitos')
      }
    }
    
    if (!formData.email.trim()) {
      validationErrors.push('E-mail é obrigatório')
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        validationErrors.push('E-mail inválido')
      }
    }
    
    if (!formData.phone_number.trim()) {
      validationErrors.push('Telefone é obrigatório')
    } else {
      const phoneNumbersOnly = formData.phone_number.replace(/\D/g, '')
      if (phoneNumbersOnly.length < 10 || phoneNumbersOnly.length > 11) {
        validationErrors.push('Telefone inválido')
      }
    }

    setErrors(validationErrors)
    return validationErrors.length === 0
  }, [formData])

  const prepareEstablishmentData = useCallback(() => {
    return {
      name: formData.name.trim(),
      social_name: formData.social_name.trim(),
      cnpj: formData.cnpj.replace(/\D/g, ''),
      full_address: formData.full_address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim().toUpperCase(),
      postal_code: formData.postal_code.replace(/\D/g, ''),
      email: formData.email.trim().toLowerCase(),
      phone_number: formData.phone_number.replace(/\D/g, ''),
    }
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const establishmentData = prepareEstablishmentData()
      console.log('Enviando dados do estabelecimento:', establishmentData)
      
      const response = await ownerApi.createEstablishment(establishmentData)
      console.log('Resposta completa do servidor:', response)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao criar estabelecimento'
        console.error('Erro ao criar estabelecimento:', errorToShow, response)
        setErrors([errorToShow])
      } else if (response.data) {
        console.log('Estabelecimento criado com sucesso!', response.data)
        const establishmentCode = response.data.establishment.code
        
        await refreshUser()
        onSuccess?.()
        navigate(`/establishment/${establishmentCode}/menus`)
      } else {
        console.error('Resposta inesperada - sem data e sem error:', response)
        setErrors(['Resposta inesperada do servidor. Verifique o console para mais detalhes.'])
      }
    } catch (err) {
      console.error('Erro ao criar estabelecimento (catch):', err)
      setErrors(['Erro ao criar estabelecimento. Tente novamente.'])
    } finally {
      setLoading(false)
    }
  }, [formData, validateForm, prepareEstablishmentData, navigate, refreshUser, onSuccess])

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setErrors,
  }
}
