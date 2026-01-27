import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { useApiData } from '../Api/useApiData'
import { Dish } from '../../types/dish'

interface UseDishOptions {
  dishId: number | undefined
  establishmentCode: string | undefined
}

export function useDish({ dishId, establishmentCode }: UseDishOptions) {
  const [dish, setDish] = useState<Dish | null>(null)
  
  const { loading, error, executeRequest } = useApiData<Dish>({
    defaultErrorMessage: 'Erro ao carregar prato',
    onSuccess: (data) => {
      setDish(data)
    }
  })

  const loadDish = useCallback(async (id: number, code: string) => {
    await executeRequest(() => ownerApi.getDish(code, id))
  }, [executeRequest])

  useEffect(() => {
    if (dishId && establishmentCode) {
      loadDish(dishId, establishmentCode)
    }
  }, [dishId, establishmentCode, loadDish])

  return { 
    dish, 
    loading, 
    error 
  }
}
