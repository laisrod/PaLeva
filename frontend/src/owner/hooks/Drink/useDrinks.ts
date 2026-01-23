import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { useApiData } from '../useApiData'
import { Drink } from '../../types/drink'

export function useDrinks(establishmentCode: string | undefined) {
  const [drinks, setDrinks] = useState<Drink[]>([])
  
  const { loading, error, executeRequest } = useApiData<Drink[]>({
    defaultErrorMessage: 'Erro ao carregar bebidas',
    onSuccess: (data) => setDrinks(data)
  })

  const loadDrinks = useCallback(async () => {
    if (!establishmentCode) {
      return
    }
    
    await executeRequest(() => ownerApi.getDrinks(establishmentCode))
  }, [establishmentCode, executeRequest])

  useEffect(() => {
    if (establishmentCode) {
      loadDrinks()
    }
  }, [establishmentCode, loadDrinks])

  return {
    drinks,
    loading,
    error,
    refetch: loadDrinks
  }
}
