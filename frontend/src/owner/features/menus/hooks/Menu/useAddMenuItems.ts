import { useState, useEffect } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'
import { Dish } from '../../types/dish'
import { Drink } from '../../types/drink'
import { Portion } from '../../types/portion'
import { AddMenuItemsProps } from '../../types/menu'

export function useAddMenuItems({ establishmentCode, menuId, onItemAdded, existingItems }: AddMenuItemsProps) {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'dishes' | 'drinks'>('dishes')
  const [adding, setAdding] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPortionModal, setShowPortionModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{ id: number; isDish: boolean; name: string } | null>(null)
  const [portions, setPortions] = useState<Portion[]>([])
  const [loadingPortions, setLoadingPortions] = useState(false)
  const [selectedPortions, setSelectedPortions] = useState<number[]>([])

  useEffect(() => {
    loadDishes()
    loadDrinks()
  }, [establishmentCode])

  const loadDishes = async () => {
    try {
      const response = await ownerApi.getDishes(establishmentCode)
      if (response.data) {
        setDishes(response.data)
      }
    } catch (err) {
      console.error('Erro ao carregar pratos:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadDrinks = async () => {
    try {
      const response = await ownerApi.getDrinks(establishmentCode)
      if (response.data) {
        setDrinks(response.data)
      }
    } catch (err) {
      console.error('Erro ao carregar bebidas:', err)
    }
  }

  const handleAddClick = async (dishId?: number, drinkId?: number) => {
    if (!dishId && !drinkId) return

    const itemId = dishId || drinkId
    if (!itemId) return

    const isDish = !!dishId
    const item = isDish 
      ? dishes.find(d => d.id === dishId)
      : drinks.find(d => d.id === drinkId)

    if (!item) return

    // Carregar porções do item
    setLoadingPortions(true)
    setSelectedItem({ id: itemId, isDish, name: item.name })
    setSelectedPortions([])

    try {
      const portionsResponse = isDish
        ? await ownerApi.portions.getPortions(establishmentCode, itemId)
        : await ownerApi.getDrinkPortions(establishmentCode, itemId)

      if (portionsResponse.data) {
        setPortions(portionsResponse.data)
        setShowPortionModal(true)
      } else {
        // Se não há porções, adicionar diretamente
        await handleAddItem(dishId, drinkId, [])
      }
    } catch (err) {
      setError('Erro ao carregar porções')
    } finally {
      setLoadingPortions(false)
    }
  }

  const handlePortionToggle = (portionId: number) => {
    setSelectedPortions(prev => {
      if (prev.includes(portionId)) {
        return prev.filter(id => id !== portionId)
      } else {
        return [...prev, portionId]
      }
    })
  }

  const handleConfirmAdd = async () => {
    if (!selectedItem) return

    const dishId = selectedItem.isDish ? selectedItem.id : undefined
    const drinkId = selectedItem.isDish ? undefined : selectedItem.id

    await handleAddItem(dishId, drinkId, selectedPortions)
    setShowPortionModal(false)
    setSelectedItem(null)
    setSelectedPortions([])
    setPortions([])
  }

  const handleAddItem = async (dishId?: number, drinkId?: number, portionIds: number[] = []) => {
    if (!dishId && !drinkId) return

    setAdding(dishId || drinkId || null)
    setError(null)

    try {
      const response = await ownerApi.createMenuItem(establishmentCode, menuId, {
        dish_id: dishId,
        drink_id: drinkId,
        portion_ids: portionIds.length > 0 ? portionIds : undefined,
      })

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        setError(errorMessage || 'Erro ao adicionar item')
        return
      }

      onItemAdded()
    } catch (err) {
      setError('Erro ao adicionar item ao cardápio')
    } finally {
      setAdding(null)
    }
  }

  const isItemInMenu = (itemId: number, isDish: boolean) => {
    return existingItems.some(item => {
      if (isDish) {
        return item.dish?.id === itemId
      } else {
        return item.drink?.id === itemId
      }
    })
  }

  return {
    dishes,
    drinks,
    loading,
    activeTab,
    setActiveTab,
    adding,
    error,
    handleAddItem: handleAddClick,
    isItemInMenu,
    showPortionModal,
    setShowPortionModal,
    selectedItem,
    portions,
    loadingPortions,
    selectedPortions,
    handlePortionToggle,
    handleConfirmAdd,
  }
}
