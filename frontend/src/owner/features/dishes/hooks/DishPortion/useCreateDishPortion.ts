import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../../../../shared/services/api'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'
import { CreatePortionFormData, PortionData, UseCreatePortionOptions } from '../../types/portion'

export function useCreateDishPortion({ establishmentCode, dishId, onSuccess }: UseCreatePortionOptions) {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState<CreatePortionFormData>({
    description: '',
    price: '',
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const fieldName = e.target.name
    const fieldValue = e.target.value

    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: fieldValue,
    }))
    
    if (errors.length > 0) {
      setErrors([])
    }
  }, [errors.length])

  const validateForm = useCallback((): boolean => {
    const validationErrors: string[] = []

    if (!formData.description.trim()) {
      validationErrors.push('Descrição é obrigatória')
    }
    
    if (!formData.price.trim()) {
      validationErrors.push('Preço é obrigatório')
    } else {
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        validationErrors.push('Preço deve ser um número maior que zero')
      }
    }

    setErrors(validationErrors)
    return validationErrors.length === 0
  }, [formData.description, formData.price])

  const preparePortionData = useCallback(() => {
    const portionData: PortionData = {
      description: formData.description.trim(),
      price: parseFloat(formData.price),
    }

    return portionData
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    if (!validateForm()) {
      return
    }

    if (!establishmentCode || !dishId) {
      setErrors(['Código do estabelecimento ou ID do prato não encontrado'])
      return
    }

    setLoading(true)

    try {
      const portionData = preparePortionData()
      const response = await ownerApi.createPortion(establishmentCode, dishId, portionData)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao criar porção'
        setErrors([errorToShow])
      } else if (response.data) {
        onSuccess?.()
        navigate(`/establishment/${establishmentCode}/dishes/${dishId}/portions`)
      }
    } catch (err) {
      setErrors(['Erro ao criar porção. Tente novamente.'])
    } finally {
      setLoading(false)
    }
  }, [validateForm, preparePortionData, establishmentCode, dishId, navigate, onSuccess])

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setFormData,
    setErrors,
  }
}
