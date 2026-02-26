import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useEditDish } from './useEditDish'
import { ownerApi } from '../../../../shared/services/api'
import { useDish } from './useDish'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    updateDish: vi.fn(),
    createTag: vi.fn(),
  },
}))

vi.mock('./useDish', () => ({
  useDish: vi.fn(),
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

describe('useEditDish', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDish).mockReturnValue({
      dish: {
        id: 5,
        name: 'Feijoada',
        description: 'Tradicional',
        calories: 500,
        tags: [{ id: 7, name: 'Caseiro' }],
      },
      loading: false,
      error: null,
    } as any)
  })

  it('prefills form data from loaded dish', async () => {
    // Arrange / Act
    const { result } = renderHook(() =>
      useEditDish({ dishId: 5, establishmentCode: 'est-1' })
    )

    // Assert
    await waitFor(() => {
      expect(result.current.formData.name).toBe('Feijoada')
      expect(result.current.formData.calories).toBe('500')
      expect(result.current.formData.selectedTags).toEqual([7])
    })
  })

  it('submits update and navigates on success', async () => {
    // Arrange
    vi.mocked(ownerApi.updateDish).mockResolvedValue({ data: { dish: { id: 5 } } } as any)
    const onSuccess = vi.fn()
    const { result } = renderHook(() =>
      useEditDish({ dishId: 5, establishmentCode: 'est-1', onSuccess })
    )
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: '  Feijoada Light  ' } } as any)
      result.current.handleChange({ target: { name: 'description', value: '  Menos gordura  ' } } as any)
      result.current.handleChange({ target: { name: 'calories', value: '350' } } as any)
    })

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(ownerApi.updateDish).toHaveBeenCalledWith('est-1', 5, {
      name: 'Feijoada Light',
      description: 'Menos gordura',
      calories: 350,
      tag_ids: [7],
    })
    expect(onSuccess).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/establishment/est-1/dishes')
  })
})
