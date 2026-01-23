import { useState, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { getErrorMessage } from '../errorHandler'

interface UseAddOrderItemOptions {
  establishmentCode: string | undefined
  orderCode: string | undefined
  onSuccess?: () => void
}

export function useAddOrderItem({ establishmentCode, orderCode, onSuccess }: UseAddOrderItemOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addItem = useCallback(async (
    options: {
      menuItemId?: number
      dishId?: number
      drinkId?: number
      portionId: number
      quantity?: number
    }
  ) => {
    if (!establishmentCode || !orderCode) {
      setError('Código do estabelecimento ou pedido não encontrado')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await ownerApi.addOrderItem(
        establishmentCode,
        orderCode,
        options
      )

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        setError(errorMessage || 'Erro ao adicionar item ao pedido')
        return false
      }

      if (response.data) {
        onSuccess?.()
        return true
      }

      return false
    } catch (err) {
      setError('Erro ao adicionar item ao pedido. Tente novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }, [establishmentCode, orderCode, onSuccess])

  return {
    addItem,
    loading,
    error,
  }
}
