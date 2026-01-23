import { useState, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { getErrorMessage } from '../errorHandler'

interface UseDeleteDrinkOptions {
  establishmentCode: string | undefined
  onSuccess?: () => void
}

export function useDeleteDrink({ establishmentCode, onSuccess }: UseDeleteDrinkOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteDrink = useCallback(async (drinkId: number) => {
    if (!establishmentCode) {
      setError('Código do estabelecimento não encontrado')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await ownerApi.deleteDrink(establishmentCode, drinkId)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao remover bebida'
        setError(errorToShow)
        return false
      } else if (response.data) {
        onSuccess?.()
        return true
      }
      return false
    } catch (err) {
      setError('Erro ao remover bebida. Tente novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }, [establishmentCode, onSuccess])

  return {
    deleteDrink,
    loading,
    error,
  }
}
