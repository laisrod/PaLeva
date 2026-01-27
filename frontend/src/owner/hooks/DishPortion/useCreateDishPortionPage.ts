import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useCreateDishPortion } from './useCreateDishPortion'


//gerencia params, auth e hook de criação
export function useCreateDishPortionPage() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireAuth()

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
