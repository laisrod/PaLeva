import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../services/api'
import { useTags } from './useTags'
import { getErrorMessage } from './errorHandler'
import { CreateDishFormData, DishData, UseCreateDishOptions } from '../types/dish'

export function useCreateDish({ establishmentCode, onSuccess }: UseCreateDishOptions) {
  const navigate = useNavigate()
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

    if (!establishmentCode) {
      setErrors(['Código do estabelecimento não encontrado'])
      return
    }

    setLoading(true)

    try {
      const dishData = prepareDishData()
      console.log('Enviando dados do prato:', dishData)
      console.log('Código do estabelecimento:', establishmentCode)
      
      const response = await ownerApi.createDish(establishmentCode, dishData)
      console.log('Resposta completa do servidor:', response)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao criar prato'
        console.error('Erro ao criar prato:', errorToShow, response)
        setErrors([errorToShow])
      } else if (response.data) {
        console.log('Prato criado com sucesso!', response.data)
        onSuccess?.()
        navigate(`/establishment/${establishmentCode}/dishes`)
      } else {
        console.error('Resposta inesperada - sem data e sem error:', response)
        setErrors(['Resposta inesperada do servidor. Verifique o console para mais detalhes.'])
      }
    } catch (err) {
      console.error('Erro ao criar prato (catch):', err)
      setErrors(['Erro ao criar prato. Tente novamente.'])
    } finally {
      setLoading(false)
    }
  }, [formData, validateForm, prepareDishData, establishmentCode, navigate, onSuccess])

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
