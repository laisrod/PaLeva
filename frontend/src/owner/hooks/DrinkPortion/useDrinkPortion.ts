import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { useApiData } from '../Api/useApiData'
import { Portion } from '../../types/portion'

interface UseDrinkPortionOptions {
  portionId: number | undefined
  establishmentCode: string | undefined
  drinkId: number | undefined
}

export function useDrinkPortion({ portionId, establishmentCode, drinkId }: UseDrinkPortionOptions) {
  const [portion, setPortion] = useState<Portion | null>(null)
  
  const { loading, error, executeRequest } = useApiData<Portion>({
    defaultErrorMessage: 'Erro ao carregar porção',
    onSuccess: (data) => {
      setPortion(data)
    }
  })

  const loadPortion = useCallback(async (id: number, code: string, drink: number) => {
    await executeRequest(() => ownerApi.getDrinkPortion(code, drink, id))
  }, [executeRequest])

  useEffect(() => {
    if (portionId && establishmentCode && drinkId) {
      loadPortion(portionId, establishmentCode, drinkId)
    }
  }, [portionId, establishmentCode, drinkId, loadPortion])

  return { 
    portion, 
    loading, 
    error 
  }
}
