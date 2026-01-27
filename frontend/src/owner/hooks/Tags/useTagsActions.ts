import { useCallback } from 'react'
import { useTags } from '../useTags'

/**
 * Hook para gerenciar ações relacionadas a tags
 */
export function useTagsActions(establishmentCode: string | undefined) {
  const { deleteTag, refetch } = useTags(establishmentCode)

  /**
   * Exclui uma tag após confirmação do usuário
   */
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

    // Recarregar a lista de tags após exclusão
    await refetch()
    return true
  }, [deleteTag, refetch])

  return {
    handleDeleteTag
  }
}
