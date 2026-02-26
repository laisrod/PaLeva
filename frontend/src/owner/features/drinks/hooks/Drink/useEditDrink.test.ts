import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useEditDrink } from './useEditDrink'
import { ownerApi } from '../../../../shared/services/api'
import { useDrink } from './useDrink'

const navigateMock = vi.fn()
const refetchDrinkMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    updateDrink: vi.fn(),
    createTag: vi.fn(),
  },
}))

vi.mock('./useDrink', () => ({
  useDrink: vi.fn(),
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

describe('useEditDrink', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDrink).mockReturnValue({
      drink: {
        id: 5,
        name: 'Refrigerante',
        description: 'Lata',
        alcoholic: false,
        calories: 80,
        tags: [{ id: 7, name: 'Gelada' }],
      },
      loading: false,
      error: null,
      refetch: refetchDrinkMock,
    } as any)
  })

  it('prefills form data from loaded drink', async () => {
    // Arrange / Act
    const { result } = renderHook(() =>
      useEditDrink({ drinkId: 5, establishmentCode: 'est-1' })
    )

    // Assert
    await waitFor(() => {
      expect(result.current.formData.name).toBe('Refrigerante')
      expect(result.current.formData.calories).toBe('80')
      expect(result.current.formData.selectedTags).toEqual([7])
    })
  })

  it('submits update, refetches and navigates on success', async () => {
    // Arrange
    vi.useFakeTimers()
    vi.mocked(ownerApi.updateDrink).mockResolvedValue({ data: { drink: { id: 5 } } } as any)
    const onSuccess = vi.fn()
    const { result } = renderHook(() =>
      useEditDrink({ drinkId: 5, establishmentCode: 'est-1', onSuccess })
    )
    act(() => {
      result.current.handleChange({ target: { name: 'name', type: 'text', value: '  Refri Zero  ' } } as any)
      result.current.handleChange({ target: { name: 'description', type: 'text', value: '  Sem acucar  ' } } as any)
      result.current.handleChange({ target: { name: 'calories', type: 'text', value: '0' } } as any)
    })

    // Act
    await act(async () => {
      const submitPromise = result.current.handleSubmit({ preventDefault: vi.fn() } as any)
      await vi.runAllTimersAsync()
      await submitPromise
    })

    // Assert
    expect(ownerApi.updateDrink).toHaveBeenCalledWith('est-1', 5, {
      name: 'Refri Zero',
      description: 'Sem acucar',
      alcoholic: false,
      calories: 0,
      tag_ids: [7],
    })
    expect(refetchDrinkMock).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/establishment/est-1/drinks')
    vi.useRealTimers()
  })
})
