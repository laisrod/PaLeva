import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCreateDrink } from './useCreateDrink'
import { ownerApi } from '../../../../shared/services/api'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    createDrink: vi.fn(),
    createTag: vi.fn(),
  },
}))

vi.mock('../../../tags/hooks/useTags', () => ({
  useTags: vi.fn(() => ({
    tags: [],
    loading: false,
    refetch: vi.fn(),
  })),
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useCreateDrink', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates required fields before submit', async () => {
    // Arrange
    const { result } = renderHook(() =>
      useCreateDrink({ establishmentCode: 'est-1' })
    )

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(result.current.errors).toContain('Nome é obrigatório')
    expect(result.current.errors).toContain('Descrição é obrigatória')
    expect(ownerApi.createDrink).not.toHaveBeenCalled()
  })

  it('submits parsed payload and navigates on success', async () => {
    // Arrange
    vi.mocked(ownerApi.createDrink).mockResolvedValue({ data: { drink: { id: 1 } } } as any)
    const onSuccess = vi.fn()
    const { result } = renderHook(() =>
      useCreateDrink({ establishmentCode: 'est-1', onSuccess })
    )
    act(() => {
      result.current.handleChange({ target: { name: 'name', type: 'text', value: '  Suco  ' } } as any)
      result.current.handleChange({ target: { name: 'description', type: 'text', value: '  Natural  ' } } as any)
      result.current.handleChange({ target: { name: 'calories', type: 'text', value: '120' } } as any)
      result.current.handleChange({
        target: { name: 'alcoholic', type: 'checkbox', value: 'on', checked: true },
      } as any)
      result.current.handleTagToggle(3)
    })

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(ownerApi.createDrink).toHaveBeenCalledWith('est-1', {
      name: 'Suco',
      description: 'Natural',
      alcoholic: true,
      calories: 120,
      tag_ids: [3],
    })
    expect(onSuccess).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/establishment/est-1/drinks')
  })
})
