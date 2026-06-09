import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthCheck } from '../../../../shared/hooks/useAuthCheck'
import { useCreateDish } from './useCreateDish'

const DESSERT_KEYWORDS = ['sobremesa', 'doce', 'dessert', 'torta', 'bolo', 'sorvete', 'pudim']

export function useCreateDessertPage() {
  const { code } = useParams<{ code: string }>()
  useAuthCheck()

  const createDish = useCreateDish({ establishmentCode: code })

  // Auto-seleciona a primeira tag de sobremesa encontrada após carregar
  useEffect(() => {
    if (!createDish.loadingTags && createDish.tags.length > 0) {
      const dessertTag = createDish.tags.find(tag =>
        DESSERT_KEYWORDS.some(kw => tag.name.toLowerCase().includes(kw))
      )
      if (dessertTag && !createDish.formData.selectedTags.includes(dessertTag.id)) {
        createDish.setFormData(prev => ({
          ...prev,
          selectedTags: [...prev.selectedTags, dessertTag.id],
        }))
      }
    }
  }, [createDish.loadingTags, createDish.tags.length])

  return {
    establishmentCode: code || '',
    ...createDish,
  }
}
