import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useAuth } from '../../../shared/hooks/useAuth'
import { useMenus } from './useMenus'

// gerencia params, auth, owner check e hook de listagem
export function useMenusPage() {
  const { code } = useParams<{ code: string }>()
  useRequireAuth()
  
  const { isOwner } = useAuth()
  const { menus, loading, error, deleteMenu } = useMenus(code)

  return {
    establishmentCode: code || '',
    isOwner,
    menus,
    loading,
    error,
    deleteMenu
  }
}
