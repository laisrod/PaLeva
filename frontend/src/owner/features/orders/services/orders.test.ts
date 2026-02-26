import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OrdersApi, invalidateOrderCache } from './orders'

describe('OrdersApi', () => {
  let api: OrdersApi
  let requestSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    api = new OrdersApi()
    requestSpy = vi.spyOn(api as any, 'request')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requests order list for an establishment', async () => {
    // Arrange
    requestSpy.mockResolvedValue({ data: [] })

    // Act
    await api.getOrders('est-1')

    // Assert
    expect(requestSpy).toHaveBeenCalledWith('/establishments/est-1/orders')
  })

  it('reuses cached order result within cache window', async () => {
    // Arrange
    requestSpy.mockResolvedValue({ data: { code: 'ORD-CACHE' } })

    // Act
    const first = await api.getOrder('est-cache', 'ORD-CACHE')
    const second = await api.getOrder('est-cache', 'ORD-CACHE')

    // Assert
    expect(requestSpy).toHaveBeenCalledTimes(1)
    expect(first).toEqual({ data: { code: 'ORD-CACHE' } })
    expect(second).toEqual({ data: { code: 'ORD-CACHE' } })
    invalidateOrderCache('est-cache', 'ORD-CACHE')
  })

  it('deduplicates in-flight requests for the same order', async () => {
    // Arrange
    let resolveRequest: (value: any) => void = () => {}
    const pendingRequest = new Promise((resolve) => {
      resolveRequest = resolve
    })
    requestSpy.mockReturnValue(pendingRequest as Promise<any>)

    // Act
    const promiseA = api.getOrder('est-inflight', 'ORD-INFLIGHT')
    const promiseB = api.getOrder('est-inflight', 'ORD-INFLIGHT')
    resolveRequest({ data: { code: 'ORD-INFLIGHT' } })
    const [resultA, resultB] = await Promise.all([promiseA, promiseB])

    // Assert
    expect(requestSpy).toHaveBeenCalledTimes(1)
    expect(resultA).toEqual(resultB)
    invalidateOrderCache('est-inflight', 'ORD-INFLIGHT')
  })

  it('sends customer_name only when provided on order creation', async () => {
    // Arrange
    requestSpy.mockResolvedValue({ data: {} })

    // Act
    await api.createOrder('est-2')
    await api.createOrder('est-2', { customer_name: 'Lais' })

    // Assert
    const firstBody = JSON.parse((requestSpy.mock.calls[0][1] as RequestInit).body as string)
    const secondBody = JSON.parse((requestSpy.mock.calls[1][1] as RequestInit).body as string)
    expect(firstBody).toEqual({ order: {} })
    expect(secondBody).toEqual({ order: { customer_name: 'Lais' } })
  })
})
