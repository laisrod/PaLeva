import { useParams } from 'react-router-dom'
import { useAuthCheck } from '../../../../shared/hooks/useAuthCheck'
import { useCreateMenu } from './useCreateMenu'

// gerencia params, auth e hook de criação
export function useCreateMenuPage() {
  const { code } = useParams<{ code: string }>()
  useAuthCheck()

  const createMenu = useCreateMenu({ establishmentCode: code })

  return {
    establishmentCode: code || '',
    ...createMenu
  }
}
