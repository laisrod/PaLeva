import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'
import { useAuth } from '../../../../../shared/hooks/useAuth'
import { useDishes } from './useDishes'
import { useDeleteDish } from './useDeleteDish'

const DESSERT_KEYWORDS = ['sobremesa', 'doce', 'dessert', 'torta', 'bolo', 'sorvete', 'pudim', 'mousse']

export function useDessertsPage() {
  const { code } = useParams<{ code: string }>()
  useRequireOwner()

  const { isOwner } = useAuth()
  const { dishes, tags, selectedTags, loading, toggleTag, searchTerm, setSearchTerm, refetch } = useDishes(code)
  const { deleteDish, loading: deleting } = useDeleteDish({
    establishmentCode: code,
    onSuccess: () => { refetch() }
  })

  // Tags consideradas de sobremesa
  const dessertTags = tags.filter(tag =>
    DESSERT_KEYWORDS.some(kw => tag.name.toLowerCase().includes(kw))
  )
  const dessertTagIds = new Set(dessertTags.map(t => t.id))

  // Filtra pratos que têm ao menos uma tag de sobremesa
  const desserts = dishes.filter(dish =>
    dish.tags && dish.tags.some(tag => dessertTagIds.has(tag.id))
  )

  // Se nenhuma tag de sobremesa existir, mostra todos os pratos (fallback)
  const displayedDesserts = dessertTags.length > 0 ? desserts : dishes

  return {
    establishmentCode: code || '',
    isOwner,
    dishes: displayedDesserts,
    tags,
    selectedTags,
    loading,
    toggleTag,
    searchTerm,
    setSearchTerm,
    deleteDish,
    deleting,
    hasDessertTags: dessertTags.length > 0,
  }
}
