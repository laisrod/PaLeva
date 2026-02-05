import { useState, useEffect } from 'react'
import { ownerApi } from '../../services/api'
import { DashboardStats } from '../../services/api/dashboard'

export type Period = 'day' | 'month' | 'year'

export function useDashboardStats(establishmentCode: string | undefined, period: Period = 'day') {
  const [stats, setStats] = useState<DashboardStats | null>(null)
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
        
        if (response.error) {
          setError(Array.isArray(response.error) ? response.error.join(', ') : response.error)
          setStats(null)
        } else if (response.data) {
          setStats(response.data)
        } else {
          setError('Dados não disponíveis')
          setStats(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas')
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [establishmentCode, period])

  return { stats, loading, error }
}
