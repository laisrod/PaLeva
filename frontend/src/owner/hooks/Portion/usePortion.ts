import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { useApiData } from '../useApiData'
import { Portion } from '../../types/portion'

interface UsePortionOptions {
  portionId: number | undefined
  establishmentCode: string | undefined
  dishId: number | undefined
}

export function usePortion({ portionId, establishmentCode, dishId }: UsePortionOptions) {
  const [portion, setPortion] = useState<Portion | null>(null)
  
  const { loading, error, executeRequest } = useApiData<Portion>({
    defaultErrorMessage: 'Erro ao carregar porção',
    onSuccess: (data) => {
      setPortion(data)
    }
  })

  const loadPortion = useCallback(async (id: number, code: string, dish: number) => {
    await executeRequest(() => ownerApi.getPortion(code, dish, id))
  }, [executeRequest])

  useEffect(() => {
    if (portionId && establishmentCode && dishId) {
      loadPortion(portionId, establishmentCode, dishId)
    }
  }, [portionId, establishmentCode, dishId, loadPortion])

  return { 
    portion, 
    loading, 
    error 
  }
}
