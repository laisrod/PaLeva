import { useState, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { getErrorMessage } from '../errorHandler'

interface UseDeletePortionOptions {
  establishmentCode: string | undefined
  dishId: number | undefined
  onSuccess?: () => void
}

export function useDeletePortion({ establishmentCode, dishId, onSuccess }: UseDeletePortionOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deletePortion = useCallback(async (portionId: number) => {
    if (!establishmentCode || !dishId) {
      setError('Código do estabelecimento ou ID do prato não encontrado')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await ownerApi.deletePortion(establishmentCode, dishId, portionId)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao remover porção'
        setError(errorToShow)
        return false
      } else if (response.data) {
        onSuccess?.()
        return true
      }
      return false
    } catch (err) {
      setError('Erro ao remover porção. Tente novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }, [establishmentCode, dishId, onSuccess])

  return {
    deletePortion,
    loading,
    error,
  }
}
