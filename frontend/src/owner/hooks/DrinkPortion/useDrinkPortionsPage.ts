import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useAuth } from '../../../shared/hooks/useAuth'
import { useDrinkPortions } from './useDrinkPortions'
import { useDeleteDrinkPortion } from './useDeleteDrinkPortion'

// gerencia params, auth, owner check e hooks de listagem, criação e deleção
export function useDrinkPortionsPage() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireAuth()
  
  const { isOwner } = useAuth()
  const drinkId = id ? parseInt(id) : undefined
  
  const { portions, loading, error, refetch } = useDrinkPortions(code, drinkId)
  const { deletePortion, loading: deleting } = useDeleteDrinkPortion({ 
    establishmentCode: code,
    drinkId: drinkId,
    onSuccess: () => {
      refetch()
    }
  })

  return {
    establishmentCode: code || '',
    drinkId: id || '',
    isOwner,
    portions,
    loading,
    error,
    deletePortion,
    deleting
  }
}
