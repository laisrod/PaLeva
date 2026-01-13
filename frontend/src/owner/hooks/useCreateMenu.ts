import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../services/api'
import { getErrorMessage } from './errorHandler'
import { CreateMenuFormData, MenuData, UseCreateMenuOptions } from '../types/menu'

export function useCreateMenu({ establishmentCode, onSuccess }: UseCreateMenuOptions) {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState<CreateMenuFormData>({
    name: '',
    description: '',
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

    if (!formData.name.trim()) {
      validationErrors.push('Nome é obrigatório')
    }
    
    if (!formData.description.trim()) {
      validationErrors.push('Descrição é obrigatória')
    }

    setErrors(validationErrors)
    return validationErrors.length === 0
  }, [formData.name, formData.description])

  const prepareMenuData = useCallback(() => {
    return {
      name: formData.name.trim(),
      description: formData.description.trim(),
    }
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    if (!validateForm()) {
      return
    }

    if (!establishmentCode) {
      setErrors(['Código do estabelecimento não encontrado'])
      return
    }

    setLoading(true)

    try {
      const menuData = prepareMenuData()
      const response = await ownerApi.createMenu(establishmentCode, menuData)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao criar cardápio'
        setErrors([errorToShow])
      } else if (response.data) {
        onSuccess?.()
        navigate(`/establishment/${establishmentCode}/menus`)
      }
    } catch (err) {
      setErrors(['Erro ao criar cardápio. Tente novamente.'])
    } finally {
      setLoading(false)
    }
  }, [formData, validateForm, prepareMenuData, establishmentCode, navigate, onSuccess])

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
    setErrors,
  }
}
