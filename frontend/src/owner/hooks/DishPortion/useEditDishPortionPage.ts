import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../shared/hooks/useRequireOwner'
import { useEditDishPortion } from './useEditDishPortion'

export function useEditDishPortionPage() {
  const { code, id, portionId } = useParams<{ code: string; id: string; portionId: string }>()
  useRequireOwner() // Verifica se é owner e redireciona se não for

  const dishId = id ? parseInt(id) : undefined

  const editDishPortion = useEditDishPortion({ 
    establishmentCode: code,
    dishId: dishId,
    portionId: portionId ? parseInt(portionId) : undefined
  })

  return {
    establishmentCode: code || '',
    dishId: id || '',
    portionId: portionId || '',
    ...editDishPortion
  }
}
