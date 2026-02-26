import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useEstablishment } from './useEstablishment'
import { ownerApi } from '../../../../shared/services/api'

const setErrorMock = vi.fn()
const setLoadingMock = vi.fn()

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getEstablishment: vi.fn(),
  },
}))

vi.mock('../../../../shared/hooks/Api/useApiData', () => ({
  useApiData: vi.fn((options: any) => ({
    loading: false,
    error: '',
    setError: setErrorMock,
    setLoading: setLoadingMock,
    executeRequest: async (apiCall: () => Promise<any>) => {
      const response = await apiCall()
      if (response?.data) {
        options?.onSuccess?.(response.data)
        return response.data
      }
      return null
    },
  })),
}))

describe('useEstablishment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('loads establishment and persists establishment code in localStorage', async () => {
    // Arrange
    const establishment = { code: 'est-1', name: 'Paleva' }
    vi.mocked(ownerApi.getEstablishment).mockResolvedValue({ data: establishment } as any)

    // Act
    const { result } = renderHook(() => useEstablishment('est-1'))

    // Assert
    await waitFor(() => {
      expect(result.current.establishment).toEqual(establishment)
    })
    expect(ownerApi.getEstablishment).toHaveBeenCalledWith('est-1')
    expect(localStorage.getItem('establishment_code')).toBe('est-1')
  })

  it('sets error when code is missing', async () => {
    // Arrange / Act
    renderHook(() => useEstablishment(undefined))

    // Assert
    await waitFor(() => {
      expect(setErrorMock).toHaveBeenCalledWith('Código do estabelecimento não encontrado')
    })
    expect(setLoadingMock).toHaveBeenCalledWith(false)
  })
})
