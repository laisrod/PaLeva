import { useState, useEffect } from 'react'
import { getRestaurants } from '../services/restaurantService'
import { Restaurant } from '../types/restaurant'

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
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
      const data = await getRestaurants()
      setRestaurants(data)
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

