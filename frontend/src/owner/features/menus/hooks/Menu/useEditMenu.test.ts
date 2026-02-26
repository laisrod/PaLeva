import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useEditMenu } from './useEditMenu'
import { ownerApi } from '../../../../shared/services/api'
import { useMenu } from './useMenu'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    updateMenu: vi.fn(),
  },
}))

vi.mock('./useMenu', () => ({
  useMenu: vi.fn(),
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useEditMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useMenu).mockReturnValue({
      menu: { name: 'Executivo', description: 'Dia', price: 19.9 },
      loading: false,
      error: null,
    } as any)
  })

  it('prefills form from loaded menu', async () => {
    // Arrange / Act
    const { result } = renderHook(() =>
      useEditMenu({ menuId: 10, establishmentCode: 'est-1' })
    )

    // Assert
    await waitFor(() => {
      expect(result.current.formData.name).toBe('Executivo')
      expect(result.current.formData.price).toBe('19.9')
    })
  })

  it('submits parsed price and navigates on success', async () => {
    // Arrange
    vi.mocked(ownerApi.updateMenu).mockResolvedValue({ data: { menu: { id: 10 } } } as any)
    const { result } = renderHook(() =>
      useEditMenu({ menuId: 10, establishmentCode: 'est-1' })
    )
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: '  Novo  ' } } as any)
      result.current.handleChange({ target: { name: 'description', value: '  Atualizado  ' } } as any)
      result.current.handleChange({ target: { name: 'price', value: '25.5' } } as any)
    })

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(ownerApi.updateMenu).toHaveBeenCalledWith('est-1', 10, {
      name: 'Novo',
      description: 'Atualizado',
      price: 25.5,
    })
    expect(navigateMock).toHaveBeenCalledWith('/establishment/est-1/menus')
  })
})
