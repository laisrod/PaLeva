import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCreateTag } from './useCreateTag'
import { ownerApi } from '../../../../shared/services/api'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
  useSearchParams: () => [new URLSearchParams('category=drink')],
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    createTag: vi.fn(),
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useCreateTag', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates required name before submit', async () => {
    // Arrange
    const { result } = renderHook(() => useCreateTag('est-1'))

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(result.current.errors).toContain('Nome é obrigatório')
    expect(ownerApi.createTag).not.toHaveBeenCalled()
  })

  it('submits trimmed name with category and navigates on success', async () => {
    // Arrange
    vi.mocked(ownerApi.createTag).mockResolvedValue({ data: { tag: { id: 3 } } } as any)
    const { result } = renderHook(() => useCreateTag('est-1'))
    act(() => {
      result.current.handleChange({ target: { value: '  Sem Lactose  ' } } as any)
    })

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(result.current.category).toBe('drink')
    expect(result.current.title).toBe('Nova característica de Bebida')
    expect(ownerApi.createTag).toHaveBeenCalledWith('est-1', 'Sem Lactose', 'drink')
    expect(navigateMock).toHaveBeenCalledWith('/establishment/est-1/tags')
  })
})
