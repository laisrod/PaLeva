import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { useApiData } from '../Api/useApiData'
import { Drink } from '../../types/drink'
import { Tag } from '../../types/tag'

export function useDrinks(establishmentCode: string | undefined) {
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  
  const { loading: loadingTags, executeRequest: executeTagsRequest } = useApiData<Tag[]>({
    defaultErrorMessage: 'Erro ao carregar características',
    onSuccess: (data) => setTags(data)
  })

  const { loading, error, executeRequest } = useApiData<Drink[]>({
    defaultErrorMessage: 'Erro ao carregar bebidas',
    onSuccess: (data) => setDrinks(data)
  })

  const loadTags = useCallback(async () => {
    if (!establishmentCode) {
      return
    }
    
    await executeTagsRequest(() => ownerApi.getTags(establishmentCode))
  }, [establishmentCode, executeTagsRequest])

  const loadDrinks = useCallback(async () => {
    if (!establishmentCode) {
      return
    }
    
    const tagIdsToFilter = selectedTags.length > 0 ? selectedTags : undefined
    await executeRequest(() => ownerApi.getDrinks(establishmentCode, tagIdsToFilter))
  }, [establishmentCode, selectedTags, executeRequest])

  useEffect(() => {
    if (establishmentCode) {
      loadTags()
    }
  }, [establishmentCode, loadTags])

  useEffect(() => {
    if (establishmentCode) {
      loadDrinks()
    }
  }, [establishmentCode, selectedTags, loadDrinks])

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

  return {
    drinks,
    tags,
    selectedTags,
    loading: loading || loadingTags,
    error,
    toggleTag,
    refetch: loadDrinks
  }
}
