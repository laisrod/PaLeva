import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../../services/api'
import { useDrinkPortion } from './useDrinkPortion'
import { getErrorMessage } from '../errorHandler'
import { CreatePortionFormData, PortionData } from '../../types/portion'

interface UseEditDrinkPortionOptions {
  establishmentCode: string | undefined
  drinkId: number | undefined
  portionId: number | undefined
  onSuccess?: () => void
}

export function useEditDrinkPortion({ establishmentCode, drinkId, portionId, onSuccess }: UseEditDrinkPortionOptions) {
  const navigate = useNavigate()
  const { portion, loading: loadingPortion, error: portionError } = useDrinkPortion({ portionId, establishmentCode, drinkId })
  
  const [formData, setFormData] = useState<CreatePortionFormData>({
    description: '',
    price: '',
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (portion) {
      setFormData({
        description: portion.description || '',
        price: portion.price?.toString() || '',
      })
    }
    
    if (portionError) {
      setErrors([portionError])
    }
  }, [portion, portionError])

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
  
    if (!portionId) {
      setErrors(['ID da porção não encontrado'])
      return
    }

    if (!establishmentCode || !drinkId) {
      setErrors(['Código do estabelecimento ou ID da bebida não encontrado'])
      return
    }
  
    setLoading(true)
  
    try {
      const portionData = preparePortionData()
      const response = await ownerApi.updateDrinkPortion(establishmentCode, drinkId, portionId, portionData)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao atualizar porção'
        setErrors([errorToShow])
      } else if (response.data) {
        onSuccess?.()
        navigate(`/establishment/${establishmentCode}/drinks/${drinkId}/portions`)
      }
    } catch (err) {
      setErrors(['Erro ao atualizar porção. Tente novamente.'])
    } finally {
      setLoading(false)
    }
  }, [validateForm, preparePortionData, portionId, establishmentCode, drinkId, navigate, onSuccess])

  return {
    formData,
    errors,
    loading: loading || loadingPortion,
    loadingPortion,
    handleChange,
    handleSubmit,
    setFormData,
    setErrors,
  }
}
