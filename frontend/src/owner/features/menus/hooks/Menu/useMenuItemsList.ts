import { useState, useCallback } from 'react'
import { MenuItemsListProps } from '../../types/menu'

// gerencia estado de seleção de itens e porções
export function useMenuItemsList(props: MenuItemsListProps) {
  const { onSelectItem } = props
  const [selectedMenuItem, setSelectedMenuItem] = useState<number | null>(null)
  const [selectedPortion, setSelectedPortion] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)

  const handleItemClick = (menuItemId: number) => {
    if (selectedMenuItem === menuItemId) {
      setSelectedMenuItem(null)
      setSelectedPortion(null)
    } else {
      setSelectedMenuItem(menuItemId)
      setSelectedPortion(null)
    }
  }

  const handlePortionClick = (portionId: number) => {
    setSelectedPortion(portionId)
  }

  const handleAddToOrder = useCallback(() => {
    if (selectedMenuItem && selectedPortion) {
      onSelectItem(selectedMenuItem, selectedPortion, quantity)
      setSelectedMenuItem(null)
      setSelectedPortion(null)
      setQuantity(1)
    }
  }, [selectedMenuItem, selectedPortion, quantity, onSelectItem])

  const handleQuantityChange = (value: number) => {
    setQuantity(Math.max(1, value || 1))
  }

  return {
    selectedMenuItem,
    selectedPortion,
    quantity,
    handleItemClick,
    handlePortionClick,
    handleAddToOrder,
    handleQuantityChange
  }
}
