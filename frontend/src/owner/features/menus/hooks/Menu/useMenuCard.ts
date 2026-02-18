import { useState, useEffect } from 'react'
import { useCurrentOrder } from '../../../orders/hooks/Orders/useCurrentOrder'
import { useAddOrderItem } from '../../../orders/hooks/Orders/useAddOrderItem'
import { ownerApi } from '../../../../shared/services/api'
import { MenuItemWithPortions } from '../../types/menu'

interface UseMenuCardProps {
  menuId: number
  establishmentCode: string
}

export function useMenuCard({ menuId, establishmentCode }: UseMenuCardProps) {
  const [showItemModal, setShowItemModal] = useState(false)
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<number | null>(null)
  const [selectedPortionId, setSelectedPortionId] = useState<number | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItemWithPortions[]>([])
  const [loadingMenuItems, setLoadingMenuItems] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [pendingAdd, setPendingAdd] = useState<{ menuItemId?: number; portionId?: number; menuId?: number; quantity: number } | null>(null)

  const { 
    currentOrder, 
    createNewOrder, 
    loadOrder 
  } = useCurrentOrder({
    establishmentCode,
    autoCreate: false
  })

  const { addItem, loading: addingItem, error: addItemError } = useAddOrderItem({
    establishmentCode,
    orderCode: currentOrder?.code,
    onSuccess: (orderCode: string) => {
      setShowItemModal(false)
      setSelectedMenuItemId(null)
      setSelectedPortionId(null)
      setPendingAdd(null)
      setSuccessMessage('Item adicionado ao pedido!')
      setTimeout(() => setSuccessMessage(null), 2000)
      
      // Recarregar o pedido para atualizar o OrderSidebar usando o orderCode recebido
      setTimeout(() => {
        console.log('[useMenuCard] onSuccess: Reloading order after item added:', orderCode)
        loadOrder(orderCode, false) // false = não silencioso, força atualização
      }, 500) // Aumentar timeout para garantir que backend processou
    }
  })

  useEffect(() => {
    if (currentOrder && pendingAdd && !addingItem) {
      addItem({ 
        menuItemId: pendingAdd.menuItemId,
        portionId: pendingAdd.portionId,
        menuId: pendingAdd.menuId,
        quantity: pendingAdd.quantity 
      }).then(() => {
        if (currentOrder?.code) {
          setTimeout(() => {
            console.log('[useMenuCard] Reloading order after pending add:', currentOrder.code)
            loadOrder(currentOrder.code, false) // false = não silencioso, força atualização
          }, 500)
        }
      })
    }
  }, [currentOrder, pendingAdd, addingItem, addItem, loadOrder])

  const loadMenuItems = async () => {
    setLoadingMenuItems(true)
    try {
      const response = await ownerApi.getMenu(establishmentCode, menuId)
      if (response.data?.menu_items) {
        // Filtrar apenas itens que têm porções
        const itemsWithPortions = response.data.menu_items.filter((item: MenuItemWithPortions) => {
          const product = item.dish || item.drink
          return product && product.portions && product.portions.length > 0
        })
        setMenuItems(itemsWithPortions)
      }
    } catch (err) {
      console.error('Erro ao carregar itens do menu:', err)
    } finally {
      setLoadingMenuItems(false)
    }
  }

  const handleAddToOrder = async () => {
    // Adicionar o menu completo como um único item
    if (!currentOrder) {
      setPendingAdd({ 
        menuId: menuId,
        quantity: 1 
      })
      
      const newOrder = await createNewOrder()
      if (!newOrder) {
        alert('Erro ao criar pedido. Tente novamente.')
        setPendingAdd(null)
        return
      }
      return
    }

    await addItem({ 
      menuId: menuId,
      quantity: 1 
    })
  }

  const handleConfirmAddToOrder = async () => {
    // Esta função não é mais necessária, mas mantida para compatibilidade
    // O menu é adicionado diretamente via handleAddToOrder
  }

  return {
    showItemModal,
    setShowItemModal,
    selectedMenuItemId,
    setSelectedMenuItemId,
    selectedPortionId,
    setSelectedPortionId,
    menuItems,
    loadingMenuItems,
    successMessage,
    addingItem,
    addItemError,
    handleAddToOrder,
    handleConfirmAddToOrder
  }
}
