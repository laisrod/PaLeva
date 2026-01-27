import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useCreateDrinkPortion } from './useCreateDrinkPortion'

// gerencia params, auth e hook de criação
export function useCreateDrinkPortionPage() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireAuth()

  const drinkId = id ? parseInt(id) : undefined

  const createDrinkPortion = useCreateDrinkPortion({ 
    establishmentCode: code,
    drinkId: drinkId
  })

  return {
    establishmentCode: code || '',
    drinkId: id || '',
    ...createDrinkPortion
  }
}
