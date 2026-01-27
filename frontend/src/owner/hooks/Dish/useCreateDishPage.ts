import { useParams } from 'react-router-dom'
import { useAuthCheck } from '../useAuthCheck'
import { useCreateDish } from './useCreateDish'

export function useCreateDishPage() {
  const { code } = useParams<{ code: string }>()
  useAuthCheck()

  const createDish = useCreateDish({ establishmentCode: code })

  return {
    establishmentCode: code || '',
    ...createDish
  }
}
