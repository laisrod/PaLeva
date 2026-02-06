import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'
import { useAuth } from '../../../../../shared/hooks/useAuth'
import { useMenus } from './useMenus'

// gerencia params, auth, owner check e hook de listagem
export function useMenusPage() {
  const { code } = useParams<{ code: string }>()
  useRequireOwner() // Verifica se é owner e redireciona se não for
  
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
