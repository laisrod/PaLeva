import { BaseApiService } from '../../../shared/services/api/base'

const getOrderInflight = new Map<string, Promise<any>>()
const getOrderCache = new Map<string, { data: any; until: number }>()
const CACHE_MS = 1500

export function invalidateOrderCache(establishmentCode: string, orderCode: string) {
  getOrderCache.delete(`${establishmentCode}|${orderCode}`)
}

export class OrdersApi extends BaseApiService {
  async getOrders(establishmentCode: string) {
    return this.request<any[]>(`/establishments/${establishmentCode}/orders`)
  }

  async getOrder(establishmentCode: string, orderCode: string) {
    const key = `${establishmentCode}|${orderCode}`
    const now = Date.now()
    const cached = getOrderCache.get(key)
    if (cached && cached.until > now) {
      return { data: cached.data }
    }

    let prom = getOrderInflight.get(key)
    if (prom) {
      return prom
    }

    prom = this.request<any>(`/establishments/${establishmentCode}/orders/${orderCode}`)
    getOrderInflight.set(key, prom)

    try {
      const res = await prom
      if (res.data && !res.error) {
        getOrderCache.set(key, { data: res.data, until: now + CACHE_MS })
      }
      return res
    } finally {
      getOrderInflight.delete(key)
    }
  }

  async updateOrder(
    establishmentCode: string,
    orderCode: string,
    orderData: {
      customer_name?: string
      customer_email?: string
      customer_phone?: string
      customer_cpf?: string
    }
  ) {
    return this.request<any>(
      `/establishments/${establishmentCode}/orders/${orderCode}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: orderData
        }),
      }
    )
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

  async confirmOrder(establishmentCode: string, orderCode: string) {
    return this.request<any>(
      `/establishments/${establishmentCode}/orders/${orderCode}/confirm`,
      { method: 'PATCH' }
    )
  }

  async deliverOrder(establishmentCode: string, orderCode: string) {
    return this.request<any>(
      `/establishments/${establishmentCode}/orders/${orderCode}/deliver`,
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

  async deleteOrder(establishmentCode: string, orderCode: string) {
    return this.request<{ message: string }>(
      `/establishments/${establishmentCode}/orders/${orderCode}`,
      { method: 'DELETE' }
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
