import { useState, useCallback } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'

interface UseMenuItemsManagementOptions {
  establishmentCode: string | undefined
  menuId: number | undefined
  onSuccess?: () => void
}

export function useMenuItemsManagement({ establishmentCode, menuId, onSuccess }: UseMenuItemsManagementOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addMenuItem = useCallback(async (dishId?: number, drinkId?: number) => {
    if (!establishmentCode || !menuId) {
      setError('Código do estabelecimento ou ID do menu não encontrado')
      return false
    }

    if (!dishId && !drinkId) {
      setError('É necessário informar um prato ou uma bebida')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await ownerApi.menus.createMenuItem(establishmentCode, menuId, {
        dish_id: dishId,
        drink_id: drinkId,
      })

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        setError(errorMessage || 'Erro ao adicionar item ao cardápio')
        return false
      }

      onSuccess?.()
      return true
    } catch (err) {
      setError('Erro ao adicionar item ao cardápio. Tente novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }, [establishmentCode, menuId, onSuccess])

  const removeMenuItem = useCallback(async (menuItemId: number) => {
    if (!establishmentCode || !menuId) {
      setError('Código do estabelecimento ou ID do menu não encontrado')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await ownerApi.menus.deleteMenuItem(establishmentCode, menuId, menuItemId)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        setError(errorMessage || 'Erro ao remover item do cardápio')
        return false
      }

      onSuccess?.()
      return true
    } catch (err) {
      setError('Erro ao remover item do cardápio. Tente novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }, [establishmentCode, menuId, onSuccess])

  return {
    addMenuItem,
    removeMenuItem,
    loading,
    error,
  }
}
