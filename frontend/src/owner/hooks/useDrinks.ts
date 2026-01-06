import { useState, useEffect } from 'react'
import { api } from '../../shared/services/api'

interface Drink {
  id: number
  name: string
  description?: string
  calories?: number
  alcoholic?: boolean
}

export function useDrinks(establishmentCode: string | undefined) {
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (establishmentCode) {
      loadDrinks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishmentCode])

  const loadDrinks = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await api.getDrinks(establishmentCode!)
      
      if (response.error) {
        setError(Array.isArray(response.error) 
          ? response.error.join(', ') 
          : response.error)
      } else if (response.data) {
        setDrinks(response.data)
      }
    } catch (err) {
      setError('Erro ao carregar bebidas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    drinks,
    loading,
    error,
    refetch: loadDrinks
  }
}

