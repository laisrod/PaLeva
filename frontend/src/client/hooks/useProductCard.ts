import { useState } from 'react'
import { Product, ProductPortion } from '../types/product'

interface UseProductCardProps {
  item: Product
  onAddToCart: (item: Product, portion?: ProductPortion) => void
}

export function useProductCard({ item, onAddToCart }: UseProductCardProps) {
  const [selectedPortion, setSelectedPortion] = useState<ProductPortion | null>(
    item.portions && item.portions.length > 0 ? item.portions[0] : null
  )

  const displayPrice = selectedPortion ? selectedPortion.price : item.price
  const displayName = selectedPortion ? `${item.name} - ${selectedPortion.name}` : item.name

  const handlePortionChange = (portionId: number) => {
    const portion = item.portions?.find(p => p.id === portionId)
    if (portion) {
      setSelectedPortion(portion)
    }
  }

  const handleAddToCart = () => {
    if (item.portions && item.portions.length > 0 && selectedPortion) {
      onAddToCart(item, selectedPortion)
    } else {
      onAddToCart(item)
    }
  }

  return {
    selectedPortion,
    displayPrice,
    displayName,
    handlePortionChange,
    handleAddToCart
  }
}
