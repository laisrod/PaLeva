import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCreateMenu } from './useCreateMenu'
import { ownerApi } from '../../../../shared/services/api'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    createMenu: vi.fn(),
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useCreateMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates required fields before submitting', async () => {
    // Arrange
    const { result } = renderHook(() => useCreateMenu({ establishmentCode: 'est-1' }))

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(result.current.errors).toContain('Nome é obrigatório')
    expect(result.current.errors).toContain('Descrição é obrigatória')
    expect(ownerApi.createMenu).not.toHaveBeenCalled()
  })

  it('submits trimmed data and navigates on success', async () => {
    // Arrange
    vi.mocked(ownerApi.createMenu).mockResolvedValue({ data: { menu: { id: 1 } } } as any)
    const onSuccess = vi.fn()
    const { result } = renderHook(() =>
      useCreateMenu({ establishmentCode: 'est-1', onSuccess })
    )
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: '  Almoco  ' } } as any)
      result.current.handleChange({ target: { name: 'description', value: '  Menu dia  ' } } as any)
    })

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(ownerApi.createMenu).toHaveBeenCalledWith('est-1', {
      name: 'Almoco',
      description: 'Menu dia',
    })
    expect(onSuccess).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/establishment/est-1/menus')
  })
})
