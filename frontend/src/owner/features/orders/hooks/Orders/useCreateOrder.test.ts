import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCreateOrder } from './useCreateOrder'
import { ownerApi } from '../../../../shared/services/api'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    createOrder: vi.fn(),
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn(),
}))

describe('useCreateOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getErrorMessage).mockImplementation((response: any) => response?.error || '')
  })

  it('returns validation error when establishment code is missing', async () => {
    // Arrange
    const { result } = renderHook(() => useCreateOrder({ establishmentCode: undefined }))

    // Act
    let createdOrder: any = null
    await act(async () => {
      createdOrder = await result.current.createOrder('Cliente')
    })

    // Assert
    expect(createdOrder).toBeNull()
    expect(result.current.error).toBe('Código do estabelecimento não encontrado')
    expect(ownerApi.createOrder).not.toHaveBeenCalled()
  })

  it('creates order and calls onSuccess when API returns order data', async () => {
    // Arrange
    const onSuccess = vi.fn()
    vi.mocked(ownerApi.createOrder).mockResolvedValue({
      data: { order: { code: 'ORD-100', id: 100 } },
    } as any)
    const { result } = renderHook(() => useCreateOrder({ establishmentCode: 'est-1', onSuccess }))

    // Act
    let createdOrder: any = null
    await act(async () => {
      createdOrder = await result.current.createOrder('Lais')
    })

    // Assert
    expect(ownerApi.createOrder).toHaveBeenCalledWith('est-1', { customer_name: 'Lais' })
    expect(createdOrder).toEqual({ code: 'ORD-100', id: 100 })
    expect(onSuccess).toHaveBeenCalledWith({ code: 'ORD-100', id: 100 })
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('sets API error when backend returns error payload', async () => {
    // Arrange
    vi.mocked(ownerApi.createOrder).mockResolvedValue({ error: 'Falha no backend' } as any)
    vi.mocked(getErrorMessage).mockReturnValue('Falha no backend')
    const { result } = renderHook(() => useCreateOrder({ establishmentCode: 'est-2' }))

    // Act
    let createdOrder: any = null
    await act(async () => {
      createdOrder = await result.current.createOrder('Cliente')
    })

    // Assert
    expect(createdOrder).toBeNull()
    expect(result.current.error).toBe('Falha no backend')
  })

  it('sets fallback error when request throws exception', async () => {
    // Arrange
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(ownerApi.createOrder).mockRejectedValue(new Error('network'))
    const { result } = renderHook(() => useCreateOrder({ establishmentCode: 'est-3' }))

    // Act
    await act(async () => {
      await result.current.createOrder('Cliente')
    })

    // Assert
    expect(result.current.error).toBe('Erro ao criar pedido. Tente novamente.')
  })
})
