import { useState, useCallback } from 'react'

export function useOrderForm() {
  const [showCreateOrder, setShowCreateOrder] = useState(false)
  const [selectedMenuId, setSelectedMenuId] = useState<number | undefined>(undefined)
  const [selectedDishId, setSelectedDishId] = useState<number | undefined>(undefined)
  const [selectedDrinkId, setSelectedDrinkId] = useState<number | undefined>(undefined)

  const handleCreateOrder = useCallback(async (createNewOrder: () => Promise<any>) => {
    await createNewOrder()
    setShowCreateOrder(true)
  }, [])

  const handleClearOrder = useCallback(() => {
    setShowCreateOrder(false)
    setSelectedMenuId(undefined)
    setSelectedDishId(undefined)
    setSelectedDrinkId(undefined)
  }, [])

  const handleSelectMenu = useCallback((menuId: number | undefined) => {
    setSelectedMenuId(menuId)
  }, [])

  const handleToggleDish = useCallback((dishId: number) => {
    setSelectedDishId((prev) => prev === dishId ? undefined : dishId)
  }, [])

  const handleToggleDrink = useCallback((drinkId: number) => {
    setSelectedDrinkId((prev) => prev === drinkId ? undefined : drinkId)
  }, [])

  const handleSelectDishPortion = useCallback(async (
    dishId: number,
    portionId: number,
    quantity: number,
    addItem: (options: { dishId: number; portionId: number; quantity: number }) => Promise<boolean>
  ) => {
    await addItem({ dishId, portionId, quantity })
    setSelectedDishId(undefined)
  }, [])

  const handleSelectDrinkPortion = useCallback(async (
    drinkId: number,
    portionId: number,
    quantity: number,
    addItem: (options: { drinkId: number; portionId: number; quantity: number }) => Promise<boolean>
  ) => {
    await addItem({ drinkId, portionId, quantity })
    setSelectedDrinkId(undefined)
  }, [])

  const handleSelectMenuItem = useCallback(async (
    menuItemId: number,
    portionId: number,
    quantity: number,
    addItem: (options: { menuItemId: number; portionId: number; quantity: number }) => Promise<boolean>
  ) => {
    await addItem({ menuItemId, portionId, quantity })
  }, [])

  return {
    showCreateOrder,
    selectedMenuId,
    selectedDishId,
    selectedDrinkId,
    handleCreateOrder,
    handleClearOrder,
    handleSelectMenu,
    handleToggleDish,
    handleToggleDrink,
    handleSelectDishPortion,
    handleSelectDrinkPortion,
    handleSelectMenuItem,
  }
}
