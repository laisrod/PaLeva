import { useState, useCallback } from 'react'
import { useMenuItems } from './useMenuItems'
import { useMenuItemsManagement } from './useMenuItemsManagement'
import { ManagingPortions } from '../../types/menu'

interface UseEditMenuItemsOptions {
  menuId: number | undefined
  establishmentCode: string | undefined
}

export function useEditMenuItems({ menuId, establishmentCode }: UseEditMenuItemsOptions) {
  const { menuItems, loading: loadingItems, refetch: refetchItems } = useMenuItems({
    menuId,
    establishmentCode,
  })

  const { removeMenuItem, loading: removingItem } = useMenuItemsManagement({
    establishmentCode,
    menuId,
    onSuccess: refetchItems,
  })

  const [managingPortions, setManagingPortions] = useState<ManagingPortions | null>(null)

  const handleRemoveItem = useCallback(async (itemId: number) => {
    if (window.confirm('Tem certeza que deseja remover este item do cardápio?')) {
      await removeMenuItem(itemId)
    }
  }, [removeMenuItem])

  const handleManagePortions = useCallback((item: any) => {
    const product = item.dish || item.drink
    if (!product) return

    const productId = item.dish?.id || item.drink?.id
    const isDish = !!item.dish

    setManagingPortions({
      menuItemId: item.id,
      productId: productId!,
      isDish,
      productName: product.name,
    })
  }, [])

  const handleCloseManagePortions = useCallback(() => {
    setManagingPortions(null)
  }, [])

  return {
    menuItems,
    loadingItems,
    refetchItems,
    removingItem,
    managingPortions,
    handleRemoveItem,
    handleManagePortions,
    handleCloseManagePortions,
  }
}
