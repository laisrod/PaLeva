import { BaseApiService } from './base'

export class OrdersApi extends BaseApiService {
  async getOrders(establishmentCode: string) {
    return this.request<any[]>(`/establishments/${establishmentCode}/orders`)
  }

  async getOrder(establishmentCode: string, orderCode: string) {
    return this.request<any>(`/establishments/${establishmentCode}/orders/${orderCode}`)
  }

  async prepareOrder(establishmentCode: string, orderCode: string) {
    return this.request<any>(
      `/establishments/${establishmentCode}/orders/${orderCode}/prepare_order`,
      { method: 'PATCH' }
    )
  }

  async readyOrder(establishmentCode: string, orderCode: string) {
    return this.request<any>(
      `/establishments/${establishmentCode}/orders/${orderCode}/ready_order`,
      { method: 'PATCH' }
    )
  }

  async cancelOrder(
    establishmentCode: string,
    orderCode: string,
    reason?: string
  ) {
    return this.request<any>(
      `/establishments/${establishmentCode}/orders/${orderCode}/cancelled`,
      {
        method: 'PATCH',
        body: JSON.stringify({ cancellation_reason: reason }),
      }
    )
  }
}
