import { useState, useEffect, useCallback } from 'react'
import { SidekiqStats } from '../types/sidekiq'
import { ownerApi } from '../../../shared/services/api'

const EMPTY_STATS: SidekiqStats = {
  processed: 0,
  failed: 0,
  enqueued: 0,
  scheduled: 0,
  retries: 0,
  dead: 0,
  queues: []
}

export function useSidekiqStats(refreshInterval = 5000) {
  const [stats, setStats] = useState<SidekiqStats>(EMPTY_STATS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    const response = await ownerApi.getSidekiqStats()
    if (response.error) {
      setError(typeof response.error === 'string' ? response.error : response.error.join(', '))
    } else if (response.data) {
      setStats(response.data)
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchStats, refreshInterval])

  return { stats, loading, error, refresh: fetchStats }
}
