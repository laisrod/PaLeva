import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCreateEstablishment } from './useCreateEstablishment'
import { ownerApi } from '../../../../shared/services/api'
import { api } from '../../../../../shared/services/api'
import { useAuth } from '../../../../../shared/hooks/useAuth'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    createEstablishment: vi.fn(),
  },
}))

vi.mock('../../../../../shared/services/api', () => ({
  api: {
    isSignedIn: vi.fn(),
  },
}))

vi.mock('../../../../../shared/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useCreateEstablishment', () => {
  const refreshUserMock = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.mocked(useAuth).mockReturnValue({ refreshUser: refreshUserMock } as any)
    vi.mocked(api.isSignedIn).mockResolvedValue({ data: { signed_in: true, user: {} } } as any)
  })

  it('redirects to login when auth token is missing', async () => {
    // Arrange / Act
    renderHook(() => useCreateEstablishment())

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/login')
    })
  })

  it('formats cnpj value on change', () => {
    // Arrange
    localStorage.setItem('auth_token', 'token')
    const { result } = renderHook(() => useCreateEstablishment())

    // Act
    act(() => {
      result.current.handleChange({
        target: { name: 'cnpj', value: '12345678000195' },
      } as any)
    })

    // Assert
    expect(result.current.formData.cnpj).toBe('12.345.678/0001-95')
  })

  it('submits normalized payload and navigates on success', async () => {
    // Arrange
    localStorage.setItem('auth_token', 'token')
    vi.mocked(ownerApi.createEstablishment).mockResolvedValue({
      data: { establishment: { code: 'EST123' } },
    } as any)
    const onSuccess = vi.fn()
    const { result } = renderHook(() => useCreateEstablishment({ onSuccess }))

    const fill = (name: string, value: string) => {
      act(() => {
        result.current.handleChange({ target: { name, value } } as any)
      })
    }

    fill('name', '  Paleva  ')
    fill('social_name', '  Paleva LTDA ')
    fill('cnpj', '12.345.678/0001-95')
    fill('full_address', ' Rua A, 10 ')
    fill('city', ' sao paulo ')
    fill('state', 'sp')
    fill('postal_code', '12345-678')
    fill('email', 'TESTE@MAIL.COM')
    fill('phone_number', '(11) 98765-4321')

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(ownerApi.createEstablishment).toHaveBeenCalledWith({
      name: 'Paleva',
      social_name: 'Paleva LTDA',
      cnpj: '12345678000195',
      full_address: 'Rua A, 10',
      city: 'sao paulo',
      state: 'SP',
      postal_code: '12345678',
      email: 'teste@mail.com',
      phone_number: '11987654321',
    })
    expect(refreshUserMock).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/establishment/EST123/menus')
  })
})
