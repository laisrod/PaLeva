import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../../../../shared/services/api'
import { useMenu } from './useMenu'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'
import { EditMenuFormData, MenuData, UseEditMenuOptions } from '../../types/menu'

export function useEditMenu({ menuId, establishmentCode, onSuccess }: UseEditMenuOptions) {
  const navigate = useNavigate()
  const { menu, loading: loadingMenu, error: menuError } = useMenu({ menuId, establishmentCode })
  
  const [formData, setFormData] = useState<EditMenuFormData>({
    name: '',
    description: '',
    price: '',
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name,
        description: menu.description,
        price: menu.price?.toString() || '',
      })
    }
    
    if (menuError) {
      setErrors([menuError])
    }
  }, [menu, menuError])

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
    const menuData: MenuData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    }

    if (formData.price && formData.price.trim()) {
      menuData.price = parseFloat(formData.price)
    }

    return menuData
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    if (!validateForm()) {
      return
    }

    if (!menuId) {
      setErrors(['ID do cardápio não encontrado'])
      return
    }

    setLoading(true)

    try {
      if (!establishmentCode) {
        setErrors(['Código do estabelecimento não encontrado'])
        return
      }
      
      const menuData = prepareMenuData()
      const response = await ownerApi.updateMenu(establishmentCode, menuId, menuData)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao atualizar cardápio'
        setErrors([errorToShow])
      } else if (response.data) {
        onSuccess?.()
        navigate(`/establishment/${establishmentCode}/menus`)
      }
    } catch (err) {
      setErrors(['Erro ao atualizar cardápio. Tente novamente.'])
    } finally {
      setLoading(false)
    }
  }, [formData, validateForm, prepareMenuData, menuId, establishmentCode, navigate, onSuccess])

  return {
    formData,
    errors,
    loading: loading || loadingMenu,
    loadingMenu,
    handleChange,
    handleSubmit,
    setErrors,
  }
}
