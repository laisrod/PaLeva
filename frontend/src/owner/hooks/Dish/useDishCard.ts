import { useState, useEffect } from 'react'
import { useCurrentOrder } from '../Orders/useCurrentOrder'
import { useAddOrderItem } from '../Orders/useAddOrderItem'
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

  const { addItem, loading: addingItem, error: addItemError } = useAddOrderItem({
    establishmentCode,
    orderCode: currentOrder?.code,
    onSuccess: () => {
      setShowPortionModal(false)
      setSelectedPortionId(null)
      setPendingAdd(null)
      setSuccessMessage('Item adicionado ao pedido!')
      setTimeout(() => setSuccessMessage(null), 2000)
    }
  })

  useEffect(() => {
    if (currentOrder && pendingAdd && !addingItem) {
      addItem({ 
        dishId: dish.id, 
        portionId: pendingAdd.portionId, 
        quantity: pendingAdd.quantity 
      })
    }
  }, [currentOrder, pendingAdd, addingItem, dish.id, addItem])

  const handleAddToOrder = async () => {
    if (portions.length === 0 && loadingPortions) {
      return
    }

    if (portions.length === 0) {
      alert('Este prato não possui porções cadastradas. Por favor, adicione porções primeiro.')
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
        dishId: dish.id, 
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
      dishId: dish.id, 
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
