import { useState, useEffect } from 'react'
import { useCurrentOrder } from '../Orders/useCurrentOrder'
import { useAddOrderItem } from '../Orders/useAddOrderItem'
import { ownerApi } from '../../services/api'
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
    onSuccess: () => {
      setShowItemModal(false)
      setSelectedMenuItemId(null)
      setSelectedPortionId(null)
      setPendingAdd(null)
      setSuccessMessage('Item adicionado ao pedido!')
      setTimeout(() => setSuccessMessage(null), 2000)
      
      setTimeout(() => {
        const savedOrderCode = localStorage.getItem(`current_order_${establishmentCode}`)
        if (savedOrderCode) {
          loadOrder(savedOrderCode)
        } else if (currentOrder?.code) {
          loadOrder(currentOrder.code)
        }
      }, 300)
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
            loadOrder(currentOrder.code)
          }, 300)
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
