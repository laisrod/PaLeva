import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../shared/hooks/useRequireOwner'
import { useEditDrink } from './useEditDrink'
import { useDrinkPortions } from '../DrinkPortion/useDrinkPortions'

// gerencia params, auth, hook de edição e porções
export function useEditDrinkPage() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireOwner() // Verifica se é owner e redireciona se não for

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
