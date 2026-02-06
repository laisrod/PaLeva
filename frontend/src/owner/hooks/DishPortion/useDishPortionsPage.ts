import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../shared/hooks/useRequireOwner'
import { useAuth } from '../../../shared/hooks/useAuth'
import { useDishPortions } from './useDishPortions'
import { useDeleteDishPortion } from './useDeleteDishPortion'

// gerencia params, auth, owner check e hooks de listagem, criação e deleção
export function useDishPortionsPage() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireOwner() // Verifica se é owner e redireciona se não for
  
  const { isOwner } = useAuth()
  const dishId = id ? parseInt(id) : undefined
  
  const { portions, loading, error, refetch } = useDishPortions(code, dishId)
  const { deletePortion, loading: deleting } = useDeleteDishPortion({ 
    establishmentCode: code,
    dishId: dishId,
    onSuccess: () => {
      refetch()
    }
  })

  return {
    establishmentCode: code || '',
    dishId: id || '',
    isOwner,
    portions,
    loading,
    error,
    deletePortion,
    deleting
  }
}
