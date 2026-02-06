import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../../../../shared/services/api'
import { useEstablishment } from './useEstablishment'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'
import { EditEstablishmentFormData } from '../../types/establishment'

export function useEditEstablishment(establishmentCode: string | undefined) {
  const navigate = useNavigate()
  const { establishment, loading: loadingEstablishment, error: establishmentError } = useEstablishment(establishmentCode)

  const [formData, setFormData] = useState<EditEstablishmentFormData>({
    name: '',
    phone_number: '',
    email: '',
    full_address: '',
    city: '',
    state: '',
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (establishment) {
      setFormData({
        name: establishment.name ?? '',
        phone_number: establishment.phone_number ?? '',
        email: establishment.email ?? '',
        full_address: establishment.full_address ?? '',
        city: establishment.city ?? '',
        state: establishment.state ?? '',
      })
    }
    if (establishmentError) {
      setErrors([establishmentError])
    }
  }, [establishment, establishmentError])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors.length > 0) setErrors([])
  }, [errors.length])

  const validate = useCallback((): boolean => {
    const validationErrors: string[] = []
    if (!formData.name.trim()) validationErrors.push('Nome é obrigatório')
    if (!formData.phone_number.trim()) validationErrors.push('Telefone é obrigatório')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      validationErrors.push('E-mail inválido')
    }
    setErrors(validationErrors)
    return validationErrors.length === 0
  }, [formData.name, formData.phone_number, formData.email])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    if (!validate()) return
    if (!establishmentCode) {
      setErrors(['Código do estabelecimento não encontrado'])
      return
    }
    setLoading(true)
    try {
      const payload = {
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
        email: formData.email.trim() || undefined,
        full_address: formData.full_address.trim() || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
      }
      const response = await ownerApi.updateEstablishment(establishmentCode, payload)
      const err = getErrorMessage(response)
      if (err) {
        setErrors([err])
        return
      }
      navigate(`/establishment/${establishmentCode}`)
    } catch {
      setErrors(['Erro ao atualizar estabelecimento. Tente novamente.'])
    } finally {
      setLoading(false)
    }
  }, [formData, validate, establishmentCode, navigate])

  return {
    establishment,
    establishmentCode: establishmentCode ?? '',
    formData,
    errors,
    loading,
    loadingEstablishment,
    handleChange,
    handleSubmit,
  }
}
