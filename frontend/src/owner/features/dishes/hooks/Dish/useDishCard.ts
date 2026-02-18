import { useState, useEffect, useCallback } from 'react'
import { useCurrentOrder } from '../../../orders/hooks/Orders/useCurrentOrder'
import { useAddOrderItem } from '../../../orders/hooks/Orders/useAddOrderItem'
import { useDishPortions } from '../DishPortion/useDishPortions'
import { Dish } from '../../types/dish'

interface UseDishCardProps {
  dish: Dish
  establishmentCode: string
}

export function useDishCard({ dish, establishmentCode }: UseDishCardProps) {
  const [showPortionModal, setShowPortionModal] = useState(false)
  const [selectedPortionId, setSelectedPortionId] = useState<number | null>(null)
  const [pendingAdd, setPendingAdd] = useState<{ portionId: number; quantity: number } | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { 
    currentOrder, 
    createNewOrder, 
    loadOrder 
  } = useCurrentOrder({
    establishmentCode,
    autoCreate: false
  })

  const { portions, loading: loadingPortions } = useDishPortions(establishmentCode, dish.id)

  const { addItem: addItemBase, loading: addingItem, error: addItemError } = useAddOrderItem({
    establishmentCode,
    orderCode: currentOrder?.code || '', // Usar string vazia como fallback
    onSuccess: (orderCode: string) => {
      setShowPortionModal(false)
      setSelectedPortionId(null)
      setPendingAdd(null)
      setSuccessMessage('Item adicionado ao pedido!')
      setTimeout(() => setSuccessMessage(null), 2000)
      
      // Recarregar o pedido para atualizar o OrderSidebar usando o orderCode recebido
      // Usar setTimeout para garantir que o backend processou
      setTimeout(() => {
        loadOrder(orderCode, false) // false = não silencioso, força atualização
      }, 500) // Aumentar timeout para garantir que backend processou
    }
  })

  // Wrapper para addItem que sempre usa o orderCode atual
  const addItem = useCallback(async (options: Parameters<typeof addItemBase>[0], overrideOrderCode?: string) => {
    const orderCodeToUse = overrideOrderCode || currentOrder?.code || localStorage.getItem(`current_order_${establishmentCode}`)
    
    // Validar se o orderCode é válido
    if (!orderCodeToUse || orderCodeToUse === 'undefined' || orderCodeToUse === 'null' || orderCodeToUse.trim() === '') {
      console.error('[useDishCard] No valid order code available for addItem', {
        overrideOrderCode,
        currentOrderCode: currentOrder?.code,
        localStorageCode: localStorage.getItem(`current_order_${establishmentCode}`)
      })
      alert('Erro: Pedido não encontrado. Tente novamente.')
      return false
    }
    
    return addItemBase(options, orderCodeToUse)
  }, [addItemBase, currentOrder?.code, establishmentCode])

  useEffect(() => {
    if (currentOrder && pendingAdd && !addingItem && currentOrder.code) {
      
      addItem({ 
        dishId: dish.id, 
        portionId: pendingAdd.portionId, 
        quantity: pendingAdd.quantity 
      }).then((result: boolean) => {
        if (result) {
          // Limpar pendingAdd após sucesso
          setPendingAdd(null)
        }
        // Após adicionar, recarregar o pedido (não silencioso para forçar atualização)
        if (currentOrder?.code) {
          setTimeout(() => {
            loadOrder(currentOrder.code, false) // false = não silencioso, força atualização
          }, 500)
        }
      }).catch((error: unknown) => {
        console.error('[useDishCard] useEffect: Error adding item:', error)
        setPendingAdd(null)
      })
    }
  }, [currentOrder, pendingAdd, addingItem, dish.id, addItem, loadOrder])

  const handleAddToOrder = async () => {
    if (portions.length === 0 && loadingPortions) {
      return
    }

    if (portions.length === 0) {
      alert('Este prato não possui porções cadastradas. Por favor, adicione porções primeiro.')
      return
    }

    if (!currentOrder) {
      const portionId = portions.length === 1 ? portions[0].id : null
      
      if (portions.length > 1) {
        setShowPortionModal(true)
        return
      }
      
      if (!portionId) {
        alert('Erro: Porção não encontrada')
        return
      }

      setPendingAdd({ portionId, quantity: 1 })
      const newOrder = await createNewOrder()
      
      if (!newOrder || !newOrder.code) {
        alert('Erro ao criar pedido. Tente novamente.')
        setPendingAdd(null)
        return
      }

      // Aguardar um pouco para o loadOrder processar
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Usar o código do pedido recém-criado diretamente
      const orderCodeToUse = newOrder.code
      
      const result = await addItem({ 
        dishId: dish.id, 
        portionId: portionId, 
        quantity: 1 
      }, orderCodeToUse)
      
      if (result) {
        setPendingAdd(null)
        setSuccessMessage('Item adicionado ao pedido!')
        setTimeout(() => setSuccessMessage(null), 2000)
        
        // Recarregar o pedido para garantir que está atualizado
        setTimeout(() => {
          loadOrder(orderCodeToUse, false) // false = não silencioso, força atualização
        }, 500)
      } else if (addItemError) {
        alert(`Erro ao adicionar item: ${addItemError}`)
        setPendingAdd(null)
      }
      
      return
    }

    if (portions.length === 1) {
      const result = await addItem({ 
        dishId: dish.id, 
        portionId: portions[0].id, 
        quantity: 1 
      })
      
      if (result) {
        setSuccessMessage('Item adicionado ao pedido!')
        setTimeout(() => setSuccessMessage(null), 2000)
        
        // Recarregar o pedido para garantir que está atualizado
        if (currentOrder?.code) {
          setTimeout(() => {
            loadOrder(currentOrder.code, false) // false = não silencioso, força atualização
          }, 500)
        }
      } else if (addItemError) {
        alert(`Erro ao adicionar item: ${addItemError}`)
      }
      return
    }

    if (portions.length > 1) {
      setShowPortionModal(true)
      return
    }
  }

  const handleConfirmAddToOrder = async () => {
    if (!selectedPortionId) {
      alert('Por favor, selecione uma porção')
      return
    }

    let orderCodeToUse = currentOrder?.code

    if (!orderCodeToUse) {
      console.log('[useDishCard] No current order, creating new one from modal...')
      const newOrder = await createNewOrder()
      console.log('[useDishCard] New order created from modal:', newOrder)
      
      if (!newOrder || !newOrder.code) {
        alert('Erro ao criar pedido. Tente novamente.')
        return
      }
      
      orderCodeToUse = newOrder.code
      
      // Aguardar um pouco para o loadOrder processar
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    const result = await addItem({ 
      dishId: dish.id, 
      portionId: selectedPortionId, 
      quantity: 1 
    }, orderCodeToUse)
    
    if (result) {
      setShowPortionModal(false)
      setSelectedPortionId(null)
      setSuccessMessage('Item adicionado ao pedido!')
      setTimeout(() => setSuccessMessage(null), 2000)
      
      // Recarregar o pedido para garantir que está atualizado
      setTimeout(() => {
        const orderCodeToReload = orderCodeToUse || localStorage.getItem(`current_order_${establishmentCode}`)
        if (orderCodeToReload) {
          loadOrder(orderCodeToReload, false) // false = não silencioso, força atualização
        }
      }, 500)
    } else if (addItemError) {
      alert(`Erro ao adicionar item: ${addItemError}`)
    }
  }

  return {
    showPortionModal,
    setShowPortionModal,
    selectedPortionId,
    setSelectedPortionId,
    successMessage,
    portions,
    loadingPortions,
    addingItem,
    addItemError,
    handleAddToOrder,
    handleConfirmAddToOrder
  }
}
