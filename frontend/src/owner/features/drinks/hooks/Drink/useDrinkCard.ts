import { useState, useEffect } from 'react'
import { useCurrentOrder } from '../../../orders/hooks/Orders/useCurrentOrder'
import { useAddOrderItem } from '../../../orders/hooks/Orders/useAddOrderItem'
import { useDrinkPortions } from '../DrinkPortion/useDrinkPortions'
import { UseDrinkCardProps } from '../../types/drink'

//gerencia lógica do card (modal, adicionar ao pedido, etc.)

export function useDrinkCard({ drink, establishmentCode }: UseDrinkCardProps) {
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

  const { portions, loading: loadingPortions } = useDrinkPortions(establishmentCode, drink.id)

  const { addItem, loading: addingItem, error: addItemError } = useAddOrderItem({
    establishmentCode,
    orderCode: currentOrder?.code,
    onSuccess: () => {
      setShowPortionModal(false)
      setSelectedPortionId(null)
      setPendingAdd(null)
      setSuccessMessage('Item adicionado ao pedido!')
      setTimeout(() => setSuccessMessage(null), 2000)
      
      // Recarregar o pedido para atualizar o OrderSidebar
      // Usar setTimeout para garantir que o backend processou
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
        drinkId: drink.id, 
        portionId: pendingAdd.portionId, 
        quantity: pendingAdd.quantity 
      }).then(() => {
        // Após adicionar, recarregar o pedido
        if (currentOrder?.code) {
          setTimeout(() => {
            loadOrder(currentOrder.code)
          }, 300)
        }
      })
    }
  }, [currentOrder, pendingAdd, addingItem, drink.id, addItem, loadOrder])

  const handleAddToOrder = async () => {
    if (portions.length === 0 && loadingPortions) {
      return
    }

    if (portions.length === 0) {
      alert('Esta bebida não possui porções cadastradas. Por favor, adicione porções primeiro.')
      return
    }

    if (!currentOrder) {
      if (portions.length === 1) {
        setPendingAdd({ portionId: portions[0].id, quantity: 1 })
      } else {
        setShowPortionModal(true)
        return
      }
      
      const newOrder = await createNewOrder()
      if (!newOrder) {
        alert('Erro ao criar pedido. Tente novamente.')
        setPendingAdd(null)
        return
      }
      return
    }

    if (portions.length === 1) {
      await addItem({ 
        drinkId: drink.id, 
        portionId: portions[0].id, 
        quantity: 1 
      })
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

    if (!currentOrder) {
      setPendingAdd({ portionId: selectedPortionId, quantity: 1 })
      const newOrder = await createNewOrder()
      if (!newOrder) {
        alert('Erro ao criar pedido. Tente novamente.')
        setPendingAdd(null)
        return
      }
      return
    }

    await addItem({ 
      drinkId: drink.id, 
      portionId: selectedPortionId, 
      quantity: 1 
    })
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
