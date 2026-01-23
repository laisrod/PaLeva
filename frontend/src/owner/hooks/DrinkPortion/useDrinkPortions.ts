import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { useApiData } from '../useApiData'
import { Portion } from '../../types/portion'

export function useDrinkPortions(establishmentCode: string | undefined, drinkId: number | undefined) {
  const [portions, setPortions] = useState<Portion[]>([])
  
  const { loading, error, executeRequest } = useApiData<Portion[]>({
    defaultErrorMessage: 'Erro ao carregar porções',
    onSuccess: (data) => {
      setPortions(data)
    }
  })

  const loadPortions = useCallback(async () => {
    if (!establishmentCode || !drinkId) {
      return
    }
    
    await executeRequest(() => ownerApi.getDrinkPortions(establishmentCode, drinkId))
  }, [establishmentCode, drinkId, executeRequest])

  useEffect(() => {
    if (establishmentCode && drinkId) {
      loadPortions()
    }
  }, [establishmentCode, drinkId, loadPortions])

  return { 
    portions, 
    loading, 
    error,
    refetch: loadPortions
  }
}
