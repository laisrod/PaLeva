import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../shared/hooks/useRequireOwner'
import { useCurrentOrder } from './useCurrentOrder'
import { useAddOrderItem } from './useAddOrderItem'
import { useMenus } from '../Menu/useMenus'
import { useMenuItems } from '../Menu/useMenuItems'

export function useTestCreateOrderPage() {
  useRequireOwner() // Verifica se é owner e redireciona se não for
  const { code } = useParams<{ code: string }>()
  
  const { 
    currentOrder, 
    loading, 
    error, 
    createNewOrder, 
    clearOrder,
    loadOrder,
    totals,
    itemsCount
  } = useCurrentOrder({
    establishmentCode: code,
    autoCreate: false
  })

  const [selectedMenuId, setSelectedMenuId] = useState<number | undefined>(undefined)

  const { menus, loading: loadingMenus } = useMenus(code)
  const { menuItems, loading: loadingMenuItems } = useMenuItems({
    menuId: selectedMenuId,
    establishmentCode: code
  })

  const { addItem, loading: addingItem, error: addItemError } = useAddOrderItem({
    establishmentCode: code,
    orderCode: currentOrder?.code,
    onSuccess: () => {
      if (currentOrder) {
        loadOrder(currentOrder.code)
      }
    }
  })

  const handleCreateOrder = async () => {
    await createNewOrder('Cliente Teste')
  }

  const handleSelectItem = async (menuItemId: number, portionId: number, quantity: number) => {
    await addItem({ menuItemId, portionId, quantity })
  }

  return {
    // Current Order
    currentOrder,
    loading,
    error,
    totals,
    itemsCount,
    
    // Menus
    menus,
    loadingMenus,
    selectedMenuId,
    setSelectedMenuId,
    
    // Menu Items
    menuItems,
    loadingMenuItems,
    
    // Add Item
    addItemError,
    addingItem,
    
    // Handlers
    handleCreateOrder,
    handleSelectItem,
    clearOrder,
  }
}
