import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../services/api'
import { useApiData } from './Api/useApiData'
import { Tag } from '../types/tag'

export function useTags(establishmentCode: string | undefined) {
  const [tags, setTags] = useState<Tag[]>([])
  
  const { loading, error, executeRequest } = useApiData<Tag[]>({
    defaultErrorMessage: 'Erro ao carregar características',
    onSuccess: (data) => setTags(data)
  })

  const loadTags = useCallback(async () => {
    if (!establishmentCode) {
      return
    }
    
    await executeRequest(() => ownerApi.getTags(establishmentCode))
  }, [establishmentCode, executeRequest])

  useEffect(() => {
    if (establishmentCode) {
      loadTags()
    }
  }, [establishmentCode])

  const deleteTag = useCallback(async (tagId: number) => {
    if (!establishmentCode) {
      return false
    }
    
    try {
      setTags((previousTags) => previousTags.filter((tag) => tag.id !== tagId))
      return true
    } catch (err) {
      return false
    }
  }, [establishmentCode])

  return {
    tags,
    loading,
    error,
    refetch: loadTags,
    deleteTag
  }
}
