import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { useApiData } from '../Api/useApiData'
import { Drink } from '../../types/drink'

interface UseDrinkOptions {
  drinkId: number | undefined
  establishmentCode: string | undefined
}

export function useDrink({ drinkId, establishmentCode }: UseDrinkOptions) {
  const [drink, setDrink] = useState<Drink | null>(null)
  
  const { loading, error, executeRequest } = useApiData<Drink>({
    defaultErrorMessage: 'Erro ao carregar bebida',
    onSuccess: (data) => {
      setDrink(data)
    }
  })

  const loadDrink = useCallback(async (id: number, code: string) => {
    await executeRequest(() => ownerApi.getDrink(code, id))
  }, [executeRequest])

  useEffect(() => {
    if (drinkId && establishmentCode) {
      loadDrink(drinkId, establishmentCode)
    }
  }, [drinkId, establishmentCode, loadDrink])

  const refetch = useCallback(async () => {
    if (drinkId && establishmentCode) {
      await loadDrink(drinkId, establishmentCode)
    }
  }, [drinkId, establishmentCode, loadDrink])

  return { 
    drink, 
    loading, 
    error,
    refetch
  }
}
