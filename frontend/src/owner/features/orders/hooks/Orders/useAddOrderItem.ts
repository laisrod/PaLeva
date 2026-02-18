import { useState, useCallback } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'
import { UseAddOrderItemOptions, AddOrderItemOptions } from '../../types/order'

export function useAddOrderItem({ establishmentCode, orderCode, onSuccess }: UseAddOrderItemOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addItem = useCallback(async (
    options: AddOrderItemOptions,
    overrideOrderCode?: string
  ) => {
    const orderCodeToUse = overrideOrderCode || orderCode
    
    // Validar se o orderCode é válido (não undefined, null, ou string vazia)
    if (!establishmentCode || !orderCodeToUse || orderCodeToUse === 'undefined' || orderCodeToUse === 'null' || orderCodeToUse.trim() === '') {
      const errorMsg = 'Código do estabelecimento ou pedido não encontrado'
      setError(errorMsg)
      alert(errorMsg)
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await ownerApi.addOrderItem(
        establishmentCode,
        orderCodeToUse,
        options
      )

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        setError(errorMessage || 'Erro ao adicionar item ao pedido')
        alert(errorMessage || 'Erro ao adicionar item ao pedido')
        return false
      }

      if (response.data) {
        ownerApi.invalidateOrderCache(establishmentCode, orderCodeToUse)
        // Passar o orderCode usado para o onSuccess
        onSuccess?.(orderCodeToUse)
        return true
      }

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
