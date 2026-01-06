import { useState, useEffect } from 'react'
import { api } from '../../shared/services/api'

interface Establishment {
  id: number
  name: string
  code: string
  city?: string
  state?: string
}

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Establishment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRestaurants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadRestaurants = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.getEstablishments()
      
      if (response.error) {
        setError(Array.isArray(response.error) 
          ? response.error.join(', ') 
          : response.error)
      } else if (response.data) {
        setRestaurants(response.data)
      }
    } catch (err) {
      setError('Erro ao carregar restaurantes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    restaurants,
    loading,
    error,
    refetch: loadRestaurants
  }
}

