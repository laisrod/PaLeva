import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDashboardStats } from './useDashboardStats'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getDashboardStats: vi.fn(),
  },
}))

describe('useDashboardStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stops loading when establishment code is missing', async () => {
    // Arrange / Act
    const { result } = renderHook(() => useDashboardStats(undefined, 'day'))

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(ownerApi.getDashboardStats).not.toHaveBeenCalled()
  })

  it('loads and exposes dashboard stats on success', async () => {
    // Arrange
    vi.mocked(ownerApi.getDashboardStats).mockResolvedValue({
      data: {
        period: 'month',
        total_orders: 12,
        total_revenue: '1500.00',
        orders_by_status: { ready: 5 },
        top_items: [{ name: 'Pizza', quantity: 10, revenue: '500.00' }],
        sales_chart_data: [{ date: '2026-01-01', label: '01/01', revenue: 100 }],
      },
    } as any)

    // Act
    const { result } = renderHook(() => useDashboardStats('est-1', 'month'))

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
    })
    expect(ownerApi.getDashboardStats).toHaveBeenCalledWith('est-1', 'month')
    expect(result.current.stats.total_orders).toBe(12)
    expect(result.current.stats.period).toBe('month')
  })

  it('returns empty stats and error when API responds with error', async () => {
    // Arrange
    vi.mocked(ownerApi.getDashboardStats).mockResolvedValue({
      error: 'Falha ao carregar dashboard',
    } as any)

    // Act
    const { result } = renderHook(() => useDashboardStats('est-2', 'year'))

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.error).toBe('Falha ao carregar dashboard')
    expect(result.current.stats.total_orders).toBe(0)
    expect(result.current.stats.period).toBe('year')
  })
})
