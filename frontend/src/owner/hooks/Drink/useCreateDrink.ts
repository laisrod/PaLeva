import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../../services/api'
import { useTags } from '../useTags'
import { getErrorMessage } from '../errorHandler'
import { CreateDrinkFormData, DrinkData, UseCreateDrinkOptions } from '../../types/drink'

export function useCreateDrink({ establishmentCode, onSuccess }: UseCreateDrinkOptions) {
  const navigate = useNavigate()
  const { tags, loading: loadingTags, refetch: refetchTags } = useTags(establishmentCode)
  
  const [formData, setFormData] = useState<CreateDrinkFormData>({
    name: '',
    description: '',
    alcoholic: false,
    calories: '',
    photo: null,
    selectedTags: [],
    newTagName: '',
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const fieldName = e.target.name
    const fieldType = e.target.type
    const fieldValue = e.target.value
    const isChecked = (e.target as HTMLInputElement).checked

    let valueToSet: string | boolean = fieldValue
    
    if (fieldType === 'checkbox') {
      valueToSet = isChecked
    }

    setFormData((previousData) => ({
      ...previousData,
      [fieldName]: valueToSet,
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
      const isSelected = previousData.selectedTags.includes(tagId)
      return {
        ...previousData,
        selectedTags: isSelected
          ? previousData.selectedTags.filter(id => id !== tagId)
          : [...previousData.selectedTags, tagId]
      }
    })
  }, [])

  const handleCreateTag = useCallback(async () => {
    if (!formData.newTagName.trim() || !establishmentCode) {
      return
    }

    try {
      const response = await ownerApi.createTag(establishmentCode, formData.newTagName.trim())
      if (response.data) {
        await refetchTags()
        setFormData(prev => ({
          ...prev,
          newTagName: ''
        }))
      }
    } catch (err) {
      console.error('Erro ao criar característica:', err)
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

  const prepareDrinkData = useCallback(() => {
    const drinkData: DrinkData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      alcoholic: formData.alcoholic,
    }

    if (formData.calories) {
      drinkData.calories = parseInt(formData.calories)
    }

    if (formData.photo) {
      drinkData.photo = formData.photo
    }

    if (formData.selectedTags.length > 0) {
      drinkData.tag_ids = formData.selectedTags
    }

    return drinkData
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
      const drinkData = prepareDrinkData()
      const response = await ownerApi.createDrink(establishmentCode, drinkData)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao criar bebida'
        setErrors([errorToShow])
      } else if (response.data) {
        onSuccess?.()
        navigate(`/establishment/${establishmentCode}/drinks`)
      }
    } catch (err) {
      setErrors(['Erro ao criar bebida. Tente novamente.'])
    } finally {
      setLoading(false)
    }
  }, [formData, validateForm, prepareDrinkData, establishmentCode, navigate, onSuccess])

  return {
    formData,
    tags,
    errors,
    loading,
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
