import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../shared/hooks/useRequireOwner'
import { useCreateDishPortion } from './useCreateDishPortion'


//gerencia params, auth e hook de criação
export function useCreateDishPortionPage() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireOwner() // Verifica se é owner e redireciona se não for

  const dishId = id ? parseInt(id) : undefined

  const createDishPortion = useCreateDishPortion({ 
    establishmentCode: code,
    dishId: dishId
  })

  return {
    establishmentCode: code || '',
    dishId: id || '',
    ...createDishPortion
  }
}
