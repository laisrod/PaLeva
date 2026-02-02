import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { useApiData } from '../Api/useApiData'
import { Dish } from '../../types/dish'
import { Tag } from '../../types/tag'

//fala com api e retorna os pratos e as características
export function useDishes(establishmentCode: string | undefined) {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  
  const { loading: loadingTags, executeRequest: executeTagsRequest } = useApiData<Tag[]>({
    defaultErrorMessage: 'Erro ao carregar características',
    onSuccess: (data) => setTags(data)
  })

  const { loading, error, executeRequest } = useApiData<Dish[]>({
    defaultErrorMessage: 'Erro ao carregar pratos',
    onSuccess: (data) => setDishes(data)
  })

  const loadTags = useCallback(async () => {
    if (!establishmentCode) {
      return
    }
    
    await executeTagsRequest(() => ownerApi.getTags(establishmentCode, 'dish'))
  }, [establishmentCode, executeTagsRequest])

  const loadDishes = useCallback(async () => {
    if (!establishmentCode) {
      return
    }
    
    const tagIdsToFilter = selectedTags.length > 0 ? selectedTags : undefined
    await executeRequest(() => ownerApi.getDishes(establishmentCode, tagIdsToFilter))
  }, [establishmentCode, selectedTags, executeRequest])

  useEffect(() => {
    if (establishmentCode) {
      loadTags()
    }
  }, [establishmentCode, loadTags])

  useEffect(() => {
    if (establishmentCode) {
      loadDishes()
    }
  }, [establishmentCode, selectedTags, loadDishes])

  const toggleTag = useCallback((tagId: number) => {
    setSelectedTags((previousSelectedTags) => {
      const isTagSelected = previousSelectedTags.includes(tagId)
      
      if (isTagSelected) {
        return previousSelectedTags.filter((id) => id !== tagId)
      } else {
        return [...previousSelectedTags, tagId]
      }
    })
  }, [])

  // Filtrar pratos por nome
  const filteredDishes = dishes.filter(dish => {
    if (!searchTerm.trim()) return true
    return dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return {
    dishes: filteredDishes,
    tags,
    selectedTags,
    loading: loading || loadingTags,
    error,
    toggleTag,
    searchTerm,
    setSearchTerm,
    refetch: loadDishes
  }
}
