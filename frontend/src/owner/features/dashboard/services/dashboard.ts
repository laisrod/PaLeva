import { BaseApiService } from '../../../shared/services/api/base'

export interface DashboardStats {
  period: 'day' | 'month' | 'year'
  total_orders: number
  total_revenue: string
  orders_by_status: Record<string, number>
  top_items: Array<{
    name: string
    quantity: number
    revenue: string
  }>
  sales_chart_data: Array<{
    date: string
    label: string
    revenue: number
  }>
}

export class DashboardApi extends BaseApiService {
  /**
   * Get dashboard statistics for an establishment
   * @param establishmentCode - The establishment code
   * @param period - Optional period filter: 'day', 'month', or 'year' (default: 'day')
   */
  async getStats(establishmentCode: string, period: 'day' | 'month' | 'year' = 'day') {
    return this.request<DashboardStats>(
      `/establishments/${establishmentCode}/dashboard/stats?period=${period}`
    )
  }
}
