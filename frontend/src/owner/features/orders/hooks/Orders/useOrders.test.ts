import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useOrders } from './useOrders'
import { ownerApi } from '../../../../shared/services/api'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getOrders: vi.fn(),
    confirmOrder: vi.fn(),
    prepareOrder: vi.fn(),
    readyOrder: vi.fn(),
    deliverOrder: vi.fn(),
    cancelOrder: vi.fn(),
    deleteOrder: vi.fn(),
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn(),
}))

describe('useOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('alert', vi.fn())
    vi.mocked(getErrorMessage).mockImplementation((response: any) => response?.error || '')
    vi.mocked(ownerApi.getOrders).mockResolvedValue({ data: [] } as any)
  })

  it('loads orders on mount when establishment code is provided', async () => {
    // Arrange
    const apiOrders = [{ id: 1, code: 'ORD-001' }] as any
    vi.mocked(ownerApi.getOrders).mockResolvedValue({ data: apiOrders } as any)

    // Act
    const { result } = renderHook(() => useOrders('est-1'))

    // Assert
    await waitFor(() => {
      expect(result.current.orders).toEqual(apiOrders)
    })
    expect(ownerApi.getOrders).toHaveBeenCalledWith('est-1')
  })

  it('changes status with confirm action and refetches orders on success', async () => {
    // Arrange
    vi.mocked(ownerApi.confirmOrder).mockResolvedValue({ data: { ok: true } } as any)
    const { result } = renderHook(() => useOrders('est-1'))
    await waitFor(() => expect(ownerApi.getOrders).toHaveBeenCalledTimes(1))

    // Act
    await act(async () => {
      await result.current.changeStatus('ORD-100', 'confirm')
    })

    // Assert
    expect(ownerApi.confirmOrder).toHaveBeenCalledWith('est-1', 'ORD-100')
    expect(ownerApi.getOrders).toHaveBeenCalledTimes(2)
  })

  it('calls onMissingContactInfo callback instead of alert when contact data is required', async () => {
    // Arrange
    const onMissingContactInfo = vi.fn()
    vi.mocked(ownerApi.cancelOrder).mockResolvedValue({ error: 'telefone ou email obrigatório' } as any)
    vi.mocked(getErrorMessage).mockReturnValue('telefone ou email obrigatório')
    const { result } = renderHook(() => useOrders('est-1', { onMissingContactInfo }))
    await waitFor(() => expect(ownerApi.getOrders).toHaveBeenCalledTimes(1))

    // Act
    await act(async () => {
      await result.current.changeStatus('ORD-404', 'cancel')
    })

    // Assert
    expect(onMissingContactInfo).toHaveBeenCalledWith('ORD-404')
    expect(alert).not.toHaveBeenCalled()
  })

  it('alerts when deleting order returns API error', async () => {
    // Arrange
    vi.mocked(ownerApi.deleteOrder).mockResolvedValue({ error: 'Falha ao deletar' } as any)
    vi.mocked(getErrorMessage).mockReturnValue('Falha ao deletar')
    const { result } = renderHook(() => useOrders('est-1'))
    await waitFor(() => expect(ownerApi.getOrders).toHaveBeenCalledTimes(1))

    // Act
    await act(async () => {
      await result.current.deleteOrder('ORD-500')
    })

    // Assert
    expect(ownerApi.deleteOrder).toHaveBeenCalledWith('est-1', 'ORD-500')
    expect(alert).toHaveBeenCalledWith('Falha ao deletar')
  })
})
