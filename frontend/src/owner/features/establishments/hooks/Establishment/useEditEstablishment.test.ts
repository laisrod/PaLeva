import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useEditEstablishment } from './useEditEstablishment'
import { ownerApi } from '../../../../shared/services/api'
import { useEstablishment } from './useEstablishment'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    updateEstablishment: vi.fn(),
  },
}))

vi.mock('./useEstablishment', () => ({
  useEstablishment: vi.fn(),
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useEditEstablishment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useEstablishment).mockReturnValue({
      establishment: {
        name: 'Paleva',
        phone_number: '(11) 99999-9999',
        email: 'est@paleva.com',
        full_address: 'Rua A, 10',
        city: 'Sao Paulo',
        state: 'SP',
      },
      loading: false,
      error: null,
    } as any)
  })

  it('prefills form data from loaded establishment', async () => {
    // Arrange / Act
    const { result } = renderHook(() => useEditEstablishment('est-1'))

    // Assert
    await waitFor(() => {
      expect(result.current.formData.name).toBe('Paleva')
      expect(result.current.formData.phone_number).toBe('(11) 99999-9999')
    })
  })

  it('prevents submit and shows validation errors for invalid form', async () => {
    // Arrange
    const { result } = renderHook(() => useEditEstablishment('est-1'))
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: '   ' } } as any)
      result.current.handleChange({ target: { name: 'phone_number', value: '' } } as any)
      result.current.handleChange({ target: { name: 'email', value: 'invalid-email' } } as any)
    })

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(ownerApi.updateEstablishment).not.toHaveBeenCalled()
    expect(result.current.errors).toContain('Nome é obrigatório')
    expect(result.current.errors).toContain('Telefone é obrigatório')
    expect(result.current.errors).toContain('E-mail inválido')
  })

  it('updates establishment and redirects on successful submit', async () => {
    // Arrange
    vi.mocked(ownerApi.updateEstablishment).mockResolvedValue({ data: { ok: true } } as any)
    const { result } = renderHook(() => useEditEstablishment('est-1'))
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: '  Novo Nome  ' } } as any)
      result.current.handleChange({ target: { name: 'phone_number', value: ' 11999999999 ' } } as any)
      result.current.handleChange({ target: { name: 'email', value: 'teste@mail.com' } } as any)
    })

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(ownerApi.updateEstablishment).toHaveBeenCalledWith('est-1', {
      name: 'Novo Nome',
      phone_number: '11999999999',
      email: 'teste@mail.com',
      full_address: 'Rua A, 10',
      city: 'Sao Paulo',
      state: 'SP',
    })
    expect(navigateMock).toHaveBeenCalledWith('/establishment/est-1')
  })
})
