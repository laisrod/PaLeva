import { useState, useEffect } from 'react'
import { Product, ProductPortion } from '../types/product'

interface UseProductCardProps {
  item: Product
  onAddToCart: (item: Product, portion?: ProductPortion) => void
}

export function useProductCard({ item, onAddToCart }: UseProductCardProps) {
  const [selectedPortion, setSelectedPortion] = useState<ProductPortion | null>(
    item.portions && item.portions.length > 0 ? item.portions[0] : null
  )

  // Atualizar selectedPortion quando o item mudar
  useEffect(() => {
    if (item.portions && item.portions.length > 0) {
      // Se já há uma porção selecionada e ela ainda existe no item, manter
      // Caso contrário, selecionar a primeira porção
      setSelectedPortion(prev => {
        if (prev && item.portions?.some(p => p.id === prev.id)) {
          return prev // Manter a porção atual se ainda existir
        }
        return item.portions[0] // Caso contrário, usar a primeira
      })
    } else {
      setSelectedPortion(null)
    }
  }, [item.id, item.portions])

  const displayPrice = selectedPortion ? selectedPortion.price : item.price
  const displayName = selectedPortion ? `${item.name} - ${selectedPortion.name}` : item.name

  const handlePortionChange = (portionId: number) => {
    const portion = item.portions?.find(p => p.id === portionId)
    if (portion) {
      setSelectedPortion(portion)
    }
  }

  const handleAddToCart = () => {
    // Se o item tem porções, usar a porção selecionada ou a primeira disponível
    if (item.portions && item.portions.length > 0) {
      const portionToUse = selectedPortion || item.portions[0]
      if (portionToUse) {
        onAddToCart(item, portionToUse)
      } else {
        console.error('[useProductCard] Erro: Item tem porções mas nenhuma foi encontrada')
        onAddToCart(item) // Fallback: adicionar sem porção
      }
    } else {
      // Item sem porções, adicionar diretamente
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
