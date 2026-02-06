import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'
import { useEditDrinkPortion } from './useEditDrinkPortion'

// gerencia params, auth e hook de edição
export function useEditDrinkPortionPage() {
  const { code, id, portionId } = useParams<{ code: string; id: string; portionId: string }>()
  useRequireOwner() // Verifica se é owner e redireciona se não for

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
