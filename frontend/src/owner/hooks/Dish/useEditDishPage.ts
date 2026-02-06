import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../shared/hooks/useRequireOwner'
import { useEditDish } from './useEditDish'
import { useDishPortions } from '../DishPortion/useDishPortions'

//Hook da página (orquestrador) - orquestração e contexto da página
export function useEditDishPage() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireOwner() // Verifica se é owner e redireciona se não for

  const dishId = id ? parseInt(id) : undefined

  const editDish = useEditDish({ 
    dishId,
    establishmentCode: code 
  })

  const { portions, loading: loadingPortions } = useDishPortions(code, dishId)

  return {
    establishmentCode: code || '',
    dishId: id || '',
    ...editDish,
    portions,
    loadingPortions
  }
}
