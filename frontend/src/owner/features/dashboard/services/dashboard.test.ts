import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DashboardApi } from './dashboard'

describe('DashboardApi', () => {
  let api: DashboardApi
  let requestSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    api = new DashboardApi()
    requestSpy = vi.spyOn(api as any, 'request').mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requests day stats by default', async () => {
    // Arrange / Act
    await api.getStats('est-001')

    // Assert
    expect(requestSpy).toHaveBeenCalledWith('/establishments/est-001/dashboard/stats?period=day')
  })

  it('requests stats for the selected period', async () => {
    // Arrange / Act
    await api.getStats('est-001', 'month')

    // Assert
    expect(requestSpy).toHaveBeenCalledWith('/establishments/est-001/dashboard/stats?period=month')
  })
})
