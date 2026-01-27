import { useParams } from 'react-router-dom'
import { useMenu } from './useMenu'
import { MenuItem } from '../../types/menu'

// gerencia params e hook de visualização
export function useViewMenuPage() {
  const { code, id } = useParams<{ code: string; id: string }>()
  
  const menuId = id ? parseInt(id) : undefined
  const { menu, loading, error } = useMenu({ 
    menuId,
    establishmentCode: code 
  })

  // Transformar o menu do hook para o formato esperado pela view
  const menuData = menu ? {
    id: menu.id,
    name: menu.name,
    description: menu.description,
    items: [] as MenuItem[] // Por enquanto vazio, pode ser expandido depois
  } : null

  return {
    establishmentCode: code || '',
    menuId: id || '',
    menuData,
    loading,
    error
  }
}
