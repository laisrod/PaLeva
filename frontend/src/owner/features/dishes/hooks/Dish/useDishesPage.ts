import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'
import { useAuth } from '../../../../../shared/hooks/useAuth'
import { useDishes } from './useDishes'
import { useDeleteDish } from './useDeleteDish'

export function useDishesPage() {
  const { code } = useParams<{ code: string }>()
  useRequireOwner() // Verifica se é owner e redireciona se não for
  
  const { isOwner } = useAuth()
  const { dishes, tags, selectedTags, loading, toggleTag, searchTerm, setSearchTerm, refetch } = useDishes(code)
  const { deleteDish, loading: deleting } = useDeleteDish({ 
    establishmentCode: code,
    onSuccess: () => {
      refetch()
    }
  })

  return {
    establishmentCode: code || '',
    isOwner,
    dishes,
    tags,
    selectedTags,
    loading,
    toggleTag,
    searchTerm,
    setSearchTerm,
    deleteDish,
    deleting
  }
}
