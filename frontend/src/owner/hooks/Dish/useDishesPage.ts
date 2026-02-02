import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useAuth } from '../../../shared/hooks/useAuth'
import { useDishes } from './useDishes'
import { useDeleteDish } from './useDeleteDish'

export function useDishesPage() {
  const { code } = useParams<{ code: string }>()
  useRequireAuth()
  
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
