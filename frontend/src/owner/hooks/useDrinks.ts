import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../services/api'
import { useApiData } from './useApiData'
import { Drink } from '../types/drink'

export function useDrinks(establishmentCode: string | undefined) {
  const [drinks, setDrinks] = useState<Drink[]>([])
  
  const { loading, error, executeRequest } = useApiData<Drink[]>({
    defaultErrorMessage: 'Erro ao carregar bebidas',
    onSuccess: (data) => {
      console.log('Bebidas carregadas com sucesso:', data)
      setDrinks(data)
    }
  })

  const loadDrinks = useCallback(async () => {
    if (!establishmentCode) {
      console.warn('useDrinks: establishmentCode não fornecido')
      return
    }
    
    console.log('Carregando bebidas para estabelecimento:', establishmentCode)
    await executeRequest(() => ownerApi.getDrinks(establishmentCode))
  }, [establishmentCode, executeRequest])

  useEffect(() => {
    if (establishmentCode) {
      loadDrinks()
    } else {
      console.warn('useDrinks: establishmentCode não fornecido no useEffect')
      setDrinks([])
    }
  }, [establishmentCode, loadDrinks])

  return {
    drinks,
    loading,
    error,
    refetch: loadDrinks
  }
}
