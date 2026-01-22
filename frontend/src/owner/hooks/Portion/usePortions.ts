import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { useApiData } from '../useApiData'
import { Portion } from '../../types/portion'

export function usePortions(establishmentCode: string | undefined, dishId: number | undefined) {
  const [portions, setPortions] = useState<Portion[]>([])
  
  const { loading, error, executeRequest } = useApiData<Portion[]>({
    defaultErrorMessage: 'Erro ao carregar porções',
    onSuccess: (data) => {
      setPortions(data)
    }
  })

  const loadPortions = useCallback(async () => {
    if (!establishmentCode || !dishId) {
      return
    }
    
    await executeRequest(() => ownerApi.getPortions(establishmentCode, dishId))
  }, [establishmentCode, dishId, executeRequest])

  useEffect(() => {
    if (establishmentCode && dishId) {
      loadPortions()
    }
  }, [establishmentCode, dishId, loadPortions])

  return { 
    portions, 
    loading, 
    error,
    refetch: loadPortions
  }
}
