import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useEditDrink } from './useEditDrink'
import { useDrinkPortions } from '../DrinkPortion/useDrinkPortions'

// gerencia params, auth, hook de edição e porções
export function useEditDrinkPage() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireAuth()

  const drinkId = id ? parseInt(id) : undefined

  const editDrink = useEditDrink({ 
    drinkId,
    establishmentCode: code 
  })

  const { portions, loading: loadingPortions } = useDrinkPortions(code, drinkId)

  return {
    establishmentCode: code || '',
    drinkId: id || '',
    ...editDrink,
    portions,
    loadingPortions
  }
}
