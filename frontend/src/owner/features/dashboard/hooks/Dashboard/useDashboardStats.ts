import { useState, useEffect } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { DashboardStats } from '../../services//dashboard'

export type Period = 'day' | 'month' | 'year'

export function useDashboardStats(establishmentCode: string | undefined, period: Period = 'day') {
  // Estado inicial com stats vazios em vez de null
  const [stats, setStats] = useState<DashboardStats>({
    period: period,
    total_orders: 0,
    total_revenue: '0',
    orders_by_status: {},
    top_items: [],
    sales_chart_data: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!establishmentCode) {
      setLoading(false)
      return
    }

    const fetchStats = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await ownerApi.getDashboardStats(establishmentCode, period)
        
        console.log('[useDashboardStats] Response:', response)
        
        // Função auxiliar para criar stats vazios
        const createEmptyStats = (): DashboardStats => ({
          period: period,
          total_orders: 0,
          total_revenue: '0',
          orders_by_status: {},
          top_items: [],
          sales_chart_data: []
        })

        if (response.error) {
          console.error('[useDashboardStats] Error:', response.error)
          setError(Array.isArray(response.error) ? response.error.join(', ') : response.error)
          // Mesmo com erro, criar stats vazios para mostrar a interface
          setStats(createEmptyStats())
        } else if (response.data) {
          // Sempre definir stats, mesmo que os valores sejam zeros
          console.log('[useDashboardStats] Stats data:', response.data)
          setStats(response.data)
          setError(null)
        } else {
          // Se não houver response.data, criar stats vazios para mostrar a interface
          console.warn('[useDashboardStats] No data in response, creating empty stats')
          setStats(createEmptyStats())
          setError(null)
        }
      } catch (err) {
        console.error('[useDashboardStats] Exception:', err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas')
        // Mesmo com exceção, criar stats vazios para mostrar a interface
        setStats({
          period: period,
          total_orders: 0,
          total_revenue: '0',
          orders_by_status: {},
          top_items: [],
          sales_chart_data: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [establishmentCode, period])

  return { stats, loading, error }
}
