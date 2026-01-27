import { useParams } from 'react-router-dom'
import { useEditMenu } from './useEditMenu'

// gerencia params e hook de edição
export function useEditMenuPage() {
  const { code, id } = useParams<{ code: string; id: string }>()

  const menuId = id ? parseInt(id) : undefined
  const editMenu = useEditMenu({ 
    menuId,
    establishmentCode: code 
  })

  return {
    establishmentCode: code || '',
    menuId: id || '',
    ...editMenu
  }
}
