import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../../../../shared/services/api'
import { useTags } from '../../../tags/hooks/useTags'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'
import { CreateDishFormData, DishData, UseCreateDishOptions } from '../../types/dish'
import { useDishPortions } from '../DishPortion/useDishPortions'
import { useCreateDishPortion } from '../DishPortion/useCreateDishPortion'
import { useDeleteDishPortion } from '../DishPortion/useDeleteDishPortion'

export function useCreateDish({ establishmentCode, onSuccess }: UseCreateDishOptions) {
  const navigate = useNavigate()
  const { tags, loading: loadingTags, refetch: refetchTags } = useTags({ establishmentCode, category: 'dish' })
  
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
  const [createdDishId, setCreatedDishId] = useState<number | null>(null)
  
  // Hooks para gerenciar porções (só funcionam após o prato ser criado)
  const { portions, loading: loadingPortions, refetch: refetchPortions } = useDishPortions(
    createdDishId ? establishmentCode : undefined,
    createdDishId || undefined
  )
  
  const { 
    formData: portionFormData, 
    errors: portionErrors, 
    loading: creatingPortion, 
    handleChange: handlePortionChange, 
    handleSubmit: handlePortionSubmit,
    setFormData: setPortionFormData,
    setErrors: setPortionErrors
  } = useCreateDishPortion({
    establishmentCode: createdDishId ? establishmentCode : undefined,
    dishId: createdDishId || undefined,
    onSuccess: () => {
      refetchPortions()
      setPortionFormData({ description: '', price: '' })
      setPortionErrors([])
    }
  })
  
  const [editingPortionId, setEditingPortionId] = useState<number | null>(null)
  const [editPortionFormData, setEditPortionFormData] = useState({ description: '', price: '' })
  const [editPortionErrors, setEditPortionErrors] = useState<string[]>([])
  const [updatingPortion, setUpdatingPortion] = useState(false)
  
  const { deletePortion, loading: deletingPortion } = useDeleteDishPortion({
    establishmentCode: createdDishId ? establishmentCode : undefined,
    dishId: createdDishId || undefined,
    onSuccess: () => {
      refetchPortions()
    }
  })

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
      const response = await ownerApi.createTag(establishmentCode, tagName, 'dish')
      
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
      const response = await ownerApi.createDish(establishmentCode, dishData)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao criar prato'
        setErrors([errorToShow])
      } else if (response.data) {
        // Manter o ID do prato criado para permitir gerenciar porções
        const dishId = response.data.dish?.id
        if (dishId) {
          setCreatedDishId(dishId)
          // Não redirecionar, permitir gerenciar porções na mesma página
        } else {
          // Se não conseguir obter o ID, redirecionar normalmente
          console.warn('Não foi possível obter o ID do prato criado, redirecionando...')
          navigate(`/establishment/${establishmentCode}/dishes`)
        }
        onSuccess?.()
      }
    } catch (err) {
      setErrors(['Erro ao criar prato. Tente novamente.'])
    } finally {
      setLoading(false)
    }
  }, [validateForm, prepareDishData, establishmentCode, navigate, onSuccess])

  // Função para iniciar edição de porção
  const startEditPortion = useCallback((portionId: number) => {
    const portion = portions.find(p => p.id === portionId)
    if (portion) {
      setEditingPortionId(portionId)
      setEditPortionFormData({
        description: portion.description || '',
        price: portion.price?.toString() || '',
      })
      setEditPortionErrors([])
    }
  }, [portions])

  // Função para cancelar edição de porção
  const cancelEditPortion = useCallback(() => {
    setEditingPortionId(null)
    setEditPortionFormData({ description: '', price: '' })
    setEditPortionErrors([])
  }, [])

  // Função para salvar edição de porção
  const handleEditPortionSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setEditPortionErrors([])

    if (!editingPortionId || !createdDishId || !establishmentCode) {
      return
    }

    if (!editPortionFormData.description.trim()) {
      setEditPortionErrors(['Descrição é obrigatória'])
      return
    }

    if (!editPortionFormData.price.trim()) {
      setEditPortionErrors(['Preço é obrigatório'])
      return
    }

    const price = parseFloat(editPortionFormData.price)
    if (isNaN(price) || price <= 0) {
      setEditPortionErrors(['Preço deve ser um número maior que zero'])
      return
    }

    setUpdatingPortion(true)

    try {
      const portionData = {
        description: editPortionFormData.description.trim(),
        price: price,
      }
      const response = await ownerApi.updatePortion(establishmentCode, createdDishId, editingPortionId, portionData)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao atualizar porção'
        setEditPortionErrors([errorToShow])
      } else if (response.data) {
        cancelEditPortion()
        refetchPortions()
      }
    } catch (err) {
      setEditPortionErrors(['Erro ao atualizar porção. Tente novamente.'])
    } finally {
      setUpdatingPortion(false)
    }
  }, [editingPortionId, createdDishId, establishmentCode, editPortionFormData, cancelEditPortion, refetchPortions])

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
    // Porções
    createdDishId,
    portions,
    loadingPortions,
    portionFormData,
    portionErrors,
    creatingPortion,
    handlePortionChange,
    handlePortionSubmit,
    editingPortionId,
    editPortionFormData,
    editPortionErrors,
    updatingPortion,
    startEditPortion,
    cancelEditPortion,
    handleEditPortionSubmit,
    deletePortion,
    deletingPortion,
    setEditPortionFormData: (data: { description: string; price: string }) => setEditPortionFormData(data),
  }
}
