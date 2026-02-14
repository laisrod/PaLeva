import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { useApiData } from '../../../../shared/hooks/Api/useApiData'
import { Portion } from '../../types/portion'

export function useDishPortions(establishmentCode: string | undefined, dishId: number | undefined) {
  const [portions, setPortions] = useState<Portion[]>([])
  
  const { loading, error, executeRequest } = useApiData<Portion[]>({
    defaultErrorMessage: 'Erro ao carregar porções',
    onSuccess: (data) => {
      // Garantir que data seja sempre um array
      const portionsArray = Array.isArray(data) ? data : ((data as any)?.portions || [])
      setPortions(portionsArray)
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
