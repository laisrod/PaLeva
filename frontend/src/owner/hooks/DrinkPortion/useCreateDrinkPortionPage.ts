import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../shared/hooks/useRequireOwner'
import { useCreateDrinkPortion } from './useCreateDrinkPortion'

// gerencia params, auth e hook de criação
export function useCreateDrinkPortionPage() {
  const { code, id } = useParams<{ code: string; id: string }>()
  useRequireOwner() // Verifica se é owner e redireciona se não for

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
