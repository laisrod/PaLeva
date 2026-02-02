import { useViewMenuPage } from './useViewMenuPage'
import { useMenuItems } from './useMenuItems'
import { useMenuItemsManagement } from './useMenuItemsManagement'

export function useViewMenu() {
  const {
    establishmentCode,
    menuId,
    menuData,
    loading,
    error
  } = useViewMenuPage()

  const menuIdNumber = menuId ? parseInt(menuId) : undefined
  const { menuItems, loading: loadingItems, refetch: refetchItems } = useMenuItems({
    menuId: menuIdNumber,
    establishmentCode,
  })

  const { removeMenuItem, loading: removingItem } = useMenuItemsManagement({
    establishmentCode,
    menuId: menuIdNumber,
    onSuccess: refetchItems,
  })

  const handleRemoveItem = async (itemId: number) => {
    if (window.confirm('Tem certeza que deseja remover este item do cardápio?')) {
      await removeMenuItem(itemId)
    }
  }

  return {
    establishmentCode,
    menuId,
    menuData,
    loading,
    error,
    menuItems,
    loadingItems,
    removingItem,
    handleRemoveItem,
  }
}
