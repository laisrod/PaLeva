import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'
import { useAuth } from '../../../../../shared/hooks/useAuth'
import { useDrinks } from './useDrinks'
import { useDeleteDrink } from './useDeleteDrink'

// gerencia params, auth, owner check e hooks de listagem/deleção
export function useDrinksPage() {
  const { code } = useParams<{ code: string }>()
  useRequireOwner() // Verifica se é owner e redireciona se não for
  
  const { isOwner } = useAuth()
  const { drinks, tags, selectedTags, loading, error, toggleTag, searchTerm, setSearchTerm, refetch } = useDrinks(code)
  const { deleteDrink, loading: deleting } = useDeleteDrink({ 
    establishmentCode: code,
    onSuccess: () => {
      refetch()
    }
  })

  return {
    establishmentCode: code || '',
    isOwner,
    drinks,
    tags,
    selectedTags,
    loading,
    error,
    toggleTag,
    searchTerm,
    setSearchTerm,
    deleteDrink,
    deleting
  }
}
