import { useState, useCallback } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { UseDeleteDishOptions } from '../../types/dish'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'

export function useDeleteDish({ establishmentCode, onSuccess }: UseDeleteDishOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteDish = useCallback(async (dishId: number) => { //memoiza a função para não recriar em todo render
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
