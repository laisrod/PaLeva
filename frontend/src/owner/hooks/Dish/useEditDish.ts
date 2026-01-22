import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../../services/api'
import { useDish } from './useDish'
import { useTags } from '../useTags'
import { getErrorMessage } from '../errorHandler'
import { CreateDishFormData, DishData } from '../../types/dish'

interface UseEditDishOptions {
  dishId: number | undefined
  establishmentCode: string | undefined
  onSuccess?: () => void
}

export function useEditDish({ dishId, establishmentCode, onSuccess }: UseEditDishOptions) {
  const navigate = useNavigate()
  const { dish, loading: loadingDish, error: dishError } = useDish({ dishId, establishmentCode })
  const { tags, loading: loadingTags, refetch: refetchTags } = useTags(establishmentCode)
  
  const [formData, setFormData] = useState<CreateDishFormData>({
    name: '',
    description: '',
    calories: '',
    photo: null,
    selectedTags: [],
    newTagName: '',
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name || '',
        description: dish.description || '',
        calories: dish.calories?.toString() || '',
        photo: null,
        selectedTags: dish.tags?.map(tag => tag.id) || [],
        newTagName: '',
      })
    }
    
    if (dishError) {
      setErrors([dishError])
    }
  }, [dish, dishError])

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

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    
    setFormData((previousData) => ({
      ...previousData,
      photo: selectedFile,
    }))
  }, [])

  const handleTagToggle = useCallback((tagId: number) => {
    setFormData((previousData) => {
      const isTagSelected = previousData.selectedTags.includes(tagId)
      let updatedSelectedTags: number[]

      if (isTagSelected) {
        updatedSelectedTags = previousData.selectedTags.filter((id) => id !== tagId)
      } else {
        updatedSelectedTags = [...previousData.selectedTags, tagId]
      }

      return {
        ...previousData,
        selectedTags: updatedSelectedTags,
      }
    })
  }, [])

  const handleCreateTag = useCallback(async () => {
    const tagName = formData.newTagName.trim()
    
    if (!tagName || !establishmentCode) {
      return
    }

    try {
      const response = await ownerApi.createTag(establishmentCode, tagName)
      
      if (response.data) {
        const newTag = response.data.tag
        await refetchTags()
        
        setFormData((previousData) => ({
          ...previousData,
          selectedTags: [...previousData.selectedTags, newTag.id],
          newTagName: '',
        }))
      } else {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao criar característica'
        setErrors([errorToShow])
      }
    } catch (err) {
      setErrors(['Erro ao criar característica'])
    }
  }, [formData.newTagName, establishmentCode, refetchTags])

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

  const prepareDishData = useCallback(() => {
    const dishData: DishData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    }

    if (formData.calories) {
      dishData.calories = parseInt(formData.calories)
    }

    if (formData.photo) {
      dishData.photo = formData.photo
    }

    if (formData.selectedTags.length > 0) {
      dishData.tag_ids = formData.selectedTags
    }

    if (formData.newTagName.trim()) {
      dishData.tags_attributes = [{ name: formData.newTagName.trim() }]
    }

    return dishData
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
  
    if (!validateForm()) {
      return
    }
  
    if (!dishId) {
      setErrors(['ID do prato não encontrado'])
      return
    }

    if (!establishmentCode) {
      setErrors(['Código do estabelecimento não encontrado'])
      return
    }
  
    setLoading(true)
  
    try {
      const dishData = prepareDishData()
      const response = await ownerApi.updateDish(establishmentCode, dishId, dishData)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao atualizar prato'
        setErrors([errorToShow])
      } else if (response.data) {
        onSuccess?.()
        navigate(`/establishment/${establishmentCode}/dishes`)
      }
    } catch (err) {
      setErrors(['Erro ao atualizar prato. Tente novamente.'])
    } finally {
      setLoading(false)
    }
  }, [validateForm, prepareDishData, dishId, establishmentCode, navigate, onSuccess])

  return {
    formData,
    tags,
    errors,
    loading: loading || loadingDish,
    loadingDish,
    loadingTags,
    handleChange,
    handleFileChange,
    handleTagToggle,
    handleCreateTag,
    handleSubmit,
    setFormData,
    setErrors,
  }
}
