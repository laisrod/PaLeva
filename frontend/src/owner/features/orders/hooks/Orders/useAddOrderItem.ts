import { useState, useCallback } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'
import { UseAddOrderItemOptions, AddOrderItemOptions } from '../../types/order'

export function useAddOrderItem({ establishmentCode, orderCode, onSuccess }: UseAddOrderItemOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addItem = useCallback(async (
    options: AddOrderItemOptions
  ) => {
    console.log('[useAddOrderItem] addItem called:', { establishmentCode, orderCode, options })
    
    if (!establishmentCode || !orderCode) {
      const errorMsg = 'Código do estabelecimento ou pedido não encontrado'
      console.error('[useAddOrderItem]', errorMsg)
      setError(errorMsg)
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

      console.log('[useAddOrderItem] Response:', response)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        console.error('[useAddOrderItem] Error from API:', errorMessage, response)
        setError(errorMessage || 'Erro ao adicionar item ao pedido')
        alert(errorMessage || 'Erro ao adicionar item ao pedido')
        return false
      }

      if (response.data) {
        console.log('[useAddOrderItem] Item added successfully:', response.data)
        ownerApi.invalidateOrderCache(establishmentCode, orderCode)
        onSuccess?.()
        return true
      }

      console.warn('[useAddOrderItem] No data in response:', response)
      const errorMsg = 'Resposta inválida do servidor'
      setError(errorMsg)
      alert(errorMsg)
      return false
    } catch (err) {
      console.error('[useAddOrderItem] Exception:', err)
      const errorMsg = 'Erro ao adicionar item ao pedido. Tente novamente.'
      setError(errorMsg)
      alert(errorMsg)
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
