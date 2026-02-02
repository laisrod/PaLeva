import { useState, useEffect } from 'react'
import { ownerApi } from '../../services/api'
import { Portion } from '../../types/portion'
import { getErrorMessage } from '../errorHandler'

interface UseManageMenuItemPortionsOptions {
  establishmentCode: string
  menuId: number
  menuItemId: number
  productId: number
  isDish: boolean
  onSuccess?: () => void
}

export function useManageMenuItemPortions({
  establishmentCode,
  menuId,
  menuItemId,
  productId,
  isDish,
  onSuccess,
}: UseManageMenuItemPortionsOptions) {
  const [portions, setPortions] = useState<Portion[]>([])
  const [selectedPortions, setSelectedPortions] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPortions()
  }, [establishmentCode, productId, isDish])

  const loadPortions = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = isDish
        ? await ownerApi.portions.getPortions(establishmentCode, productId)
        : await ownerApi.getDrinkPortions(establishmentCode, productId)

      if (response.data) {
        setPortions(response.data)
      }

      // Carregar porções já selecionadas para este menu_item
      await loadSelectedPortions()
    } catch (err) {
      console.error('Erro ao carregar porções:', err)
      setError('Erro ao carregar porções')
    } finally {
      setLoading(false)
    }
  }

  const loadSelectedPortions = async () => {
    try {
      const response = await ownerApi.getMenu(establishmentCode, menuId)
      if (response.data?.menu_items) {
        const menuItem = response.data.menu_items.find((item: any) => item.id === menuItemId)
        if (menuItem) {
          const product = menuItem.dish || menuItem.drink
          // As porções retornadas são apenas as selecionadas para este menu_item
          const selected = product?.portions?.map((p: any) => p.id) || []
          setSelectedPortions(selected)
        }
      }
    } catch (err) {
      console.error('Erro ao carregar porções selecionadas:', err)
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

  const handleSave = async () => {
    if (selectedPortions.length === 0) {
      setError('Selecione pelo menos uma porção')
      return false
    }

    setSaving(true)
    setError(null)

    try {
      const response = await ownerApi.updateMenuItem(establishmentCode, menuId, menuItemId, selectedPortions)
      
      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        setError(errorMessage || 'Erro ao atualizar porções')
        return false
      }

      onSuccess?.()
      return true
    } catch (err) {
      setError('Erro ao atualizar porções')
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    portions,
    selectedPortions,
    loading,
    saving,
    error,
    handlePortionToggle,
    handleSave,
  }
}
