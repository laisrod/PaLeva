import { useState, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { getErrorMessage } from '../errorHandler'

interface UseDeleteDrinkPortionOptions {
  establishmentCode: string | undefined
  drinkId: number | undefined
  onSuccess?: () => void
}

export function useDeleteDrinkPortion({ establishmentCode, drinkId, onSuccess }: UseDeleteDrinkPortionOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deletePortion = useCallback(async (portionId: number) => {
    if (!establishmentCode || !drinkId) {
      setError('Código do estabelecimento ou ID da bebida não encontrado')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await ownerApi.deleteDrinkPortion(establishmentCode, drinkId, portionId)

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
  }, [establishmentCode, drinkId, onSuccess])

  return {
    deletePortion,
    loading,
    error,
  }
}
