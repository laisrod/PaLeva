import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../services/api'
import { useApiData } from './Api/useApiData'
import { Tag, TagCategory } from '../types/tag'

interface UseTagsOptions {
  establishmentCode: string | undefined
  category?: TagCategory
}

export function useTags(establishmentCodeOrOptions: string | undefined | UseTagsOptions, categoryParam?: TagCategory) {
  // Support both old signature (string) and new signature (object)
  const options: UseTagsOptions = typeof establishmentCodeOrOptions === 'object' && establishmentCodeOrOptions !== null
    ? establishmentCodeOrOptions
    : { establishmentCode: establishmentCodeOrOptions, category: categoryParam }

  const { establishmentCode, category } = options

  const [tags, setTags] = useState<Tag[]>([])
  
  const { loading, error, executeRequest } = useApiData<Tag[]>({
    defaultErrorMessage: 'Erro ao carregar características',
    onSuccess: (data) => setTags(data)
  })

  const loadTags = useCallback(async () => {
    if (!establishmentCode) {
      return
    }
    
    await executeRequest(() => ownerApi.getTags(establishmentCode, category))
  }, [establishmentCode, category, executeRequest])

  // Reset tags when category changes and reload
  useEffect(() => {
    setTags([]) // Clear tags before loading new ones
    if (establishmentCode) {
      loadTags()
    }
  }, [establishmentCode, category, loadTags])

  const deleteTag = useCallback(async (tagId: number) => {
    if (!establishmentCode) return false
    try {
      const res = await ownerApi.deleteTag(establishmentCode, tagId)
      if (res.error) return false
      setTags((prev) => prev.filter((t) => t.id !== tagId))
      return true
    } catch {
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
