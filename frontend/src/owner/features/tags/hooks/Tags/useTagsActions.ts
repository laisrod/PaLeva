import { useCallback } from 'react'

interface UseTagsActionsOptions {
  deleteTag: (tagId: number) => Promise<boolean>
  refetch: () => Promise<void>
}


export function useTagsActions({ deleteTag, refetch }: UseTagsActionsOptions) {

  const handleDeleteTag = useCallback(async (tagId: number): Promise<boolean> => {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta característica?')
    
    if (!confirmed) {
      return false
    }

    const success = await deleteTag(tagId)
    
    if (!success) {
      alert('Erro ao excluir característica')
      return false
    }

    await refetch()
    return true
  }, [deleteTag, refetch])

  return {
    handleDeleteTag
  }
}
