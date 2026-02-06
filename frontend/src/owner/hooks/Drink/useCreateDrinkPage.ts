import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../shared/hooks/useRequireOwner'
import { useCreateDrink } from './useCreateDrink'


//gerencia params, auth e hook de criação
export function useCreateDrinkPage() {
  const { code } = useParams<{ code: string }>()
  useRequireOwner() // Verifica se é owner e redireciona se não for

  const createDrink = useCreateDrink({ establishmentCode: code })

  return {
    establishmentCode: code || '',
    ...createDrink
  }
}
