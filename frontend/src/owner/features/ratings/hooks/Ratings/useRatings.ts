import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { useApiData } from '../../../../shared/hooks/Api/useApiData'

export interface RatingData {
  order_reviews: Array<{
    id: number
    type: string
    rating: number
    comment?: string
    created_at: string
    user: { id: number; name: string; email: string }
    order: { id: number; code: string; total_price: number; status: string }
  }>
  dish_ratings: Array<{
    id: number
    type: string
    rating: number
    comment?: string
    created_at: string
    user: { id: number; name: string; email: string }
    item: { id: number; name: string; type: string }
  }>
  drink_ratings: Array<{
    id: number
    type: string
    rating: number
    comment?: string
    created_at: string
    user: { id: number; name: string; email: string }
    item: { id: number; name: string; type: string }
  }>
  statistics: {
    total_order_reviews: number
    total_dish_ratings: number
    total_drink_ratings: number
    average_order_rating: number
    average_dish_rating: number
    average_drink_rating: number
    overall_average: number
  }
}

export function useRatings(establishmentCode: string | undefined) {
  const [ratings, setRatings] = useState<RatingData | null>(null)

  const { loading, error, executeRequest } = useApiData<RatingData>({
    defaultErrorMessage: 'Erro ao carregar avaliações',
    onSuccess: (data) => setRatings(data),
  })

  const fetchRatings = useCallback(async () => {
    if (!establishmentCode) return

    await executeRequest(
      async () => {
        const response = await ownerApi.getRatings(establishmentCode)
        return response as { data?: RatingData; error?: string | string[] }
      },
      'Erro ao carregar avaliações'
    )
  }, [establishmentCode, executeRequest])

  useEffect(() => {
    fetchRatings()
  }, [fetchRatings])

  return {
    ratings,
    loading,
    error,
    refetch: fetchRatings,
  }
}
