import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCreateDish } from './useCreateDish'
import { ownerApi } from '../../../../shared/services/api'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    createDish: vi.fn(),
    createTag: vi.fn(),
    updatePortion: vi.fn(),
  },
}))

vi.mock('../../../tags/hooks/useTags', () => ({
  useTags: vi.fn(() => ({
    tags: [],
    loading: false,
    refetch: vi.fn(),
  })),
}))

vi.mock('../DishPortion/useDishPortions', () => ({
  useDishPortions: vi.fn(() => ({
    portions: [],
    loading: false,
    refetch: vi.fn(),
  })),
}))

vi.mock('../DishPortion/useCreateDishPortion', () => ({
  useCreateDishPortion: vi.fn(() => ({
    formData: { description: '', price: '' },
    errors: [],
    loading: false,
    handleChange: vi.fn(),
    handleSubmit: vi.fn(),
    setFormData: vi.fn(),
    setErrors: vi.fn(),
  })),
}))

vi.mock('../DishPortion/useDeleteDishPortion', () => ({
  useDeleteDishPortion: vi.fn(() => ({
    deletePortion: vi.fn(),
    loading: false,
  })),
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useCreateDish', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates required fields before submit', async () => {
    // Arrange
    const { result } = renderHook(() =>
      useCreateDish({ establishmentCode: 'est-1' })
    )

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(result.current.errors).toContain('Nome é obrigatório')
    expect(result.current.errors).toContain('Descrição é obrigatória')
    expect(ownerApi.createDish).not.toHaveBeenCalled()
  })

  it('submits parsed payload and keeps user on page when created dish id is returned', async () => {
    // Arrange
    const onSuccess = vi.fn()
    vi.mocked(ownerApi.createDish).mockResolvedValue({
      data: { dish: { id: 21 } },
    } as any)
    const { result } = renderHook(() =>
      useCreateDish({ establishmentCode: 'est-1', onSuccess })
    )
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: '  Feijoada  ' } } as any)
      result.current.handleChange({ target: { name: 'description', value: '  Tradicional  ' } } as any)
      result.current.handleChange({ target: { name: 'calories', value: '650' } } as any)
      result.current.handleTagToggle(3)
    })

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(ownerApi.createDish).toHaveBeenCalledWith('est-1', {
      name: 'Feijoada',
      description: 'Tradicional',
      calories: 650,
      tag_ids: [3],
    })
    expect(result.current.createdDishId).toBe(21)
    expect(onSuccess).toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
