import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useCreateDrink } from './useCreateDrink'


//gerencia params, auth e hook de criação
export function useCreateDrinkPage() {
  const { code } = useParams<{ code: string }>()
  useRequireAuth()

  const createDrink = useCreateDrink({ establishmentCode: code })

  return {
    establishmentCode: code || '',
    ...createDrink
  }
}
