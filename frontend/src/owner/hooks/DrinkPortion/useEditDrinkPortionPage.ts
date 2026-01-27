import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useEditDrinkPortion } from './useEditDrinkPortion'

// gerencia params, auth e hook de edição
export function useEditDrinkPortionPage() {
  const { code, id, portionId } = useParams<{ code: string; id: string; portionId: string }>()
  useRequireAuth()

  const drinkId = id ? parseInt(id) : undefined
  const portion = portionId ? parseInt(portionId) : undefined

  const editDrinkPortion = useEditDrinkPortion({ 
    establishmentCode: code,
    drinkId: drinkId,
    portionId: portion
  })

  return {
    establishmentCode: code || '',
    drinkId: id || '',
    portionId: portionId || '',
    ...editDrinkPortion
  }
}
