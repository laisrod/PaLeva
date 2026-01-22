import { useState, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { getErrorMessage } from '../errorHandler'

interface UseDeleteDishOptions {
  establishmentCode: string | undefined
  onSuccess?: () => void
}

export function useDeleteDish({ establishmentCode, onSuccess }: UseDeleteDishOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteDish = useCallback(async (dishId: number) => {
    if (!establishmentCode) {
      setError('Código do estabelecimento não encontrado')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await ownerApi.deleteDish(establishmentCode, dishId)

      if (response.error || response.errors) {
        const errorMessage = getErrorMessage(response)
        const errorToShow = errorMessage || 'Erro ao remover prato'
        setError(errorToShow)
        return false
      } else if (response.data) {
        onSuccess?.()
        return true
      }
      return false
    } catch (err) {
      setError('Erro ao remover prato. Tente novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }, [establishmentCode, onSuccess])

  return {
    deleteDish,
    loading,
    error,
  }
}
