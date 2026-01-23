import { BaseApiService } from '../base'

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

  async createOrder(establishmentCode: string, orderData?: { customer_name?: string }) {
    const orderPayload: { customer_name?: string } = {}
    if (orderData?.customer_name) {
      orderPayload.customer_name = orderData.customer_name
    }

    return this.request<{
      order: {
        id: number
        code: string
        status: string
        total_price: number
        customer_name?: string
      }
      message: string
    }>(`/establishments/${establishmentCode}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: orderPayload
      }),
    })
  }
}
