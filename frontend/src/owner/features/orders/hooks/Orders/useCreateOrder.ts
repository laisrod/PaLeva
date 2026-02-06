import { useState, useCallback } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'
import { UseCreateOrderOptions } from '../../types/order'

export function useCreateOrder({ establishmentCode, onSuccess }: UseCreateOrderOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = useCallback(async (customerName?: string) => {
    if (!establishmentCode) {
      setError('Código do estabelecimento não encontrado')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await ownerApi.createOrder(establishmentCode, {
        customer_name: customerName
      })

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        setError(errorMessage || 'Erro ao criar pedido')
        return null
      }

      if (response.data?.order) {
        onSuccess?.(response.data.order)
        return response.data.order
      }

      return null
    } catch (err) {
      setError('Erro ao criar pedido. Tente novamente.')
      return null
    } finally {
      setLoading(false)
    }
  }, [establishmentCode, onSuccess])

  return {
    createOrder,
    loading,
    error,
  }
}
