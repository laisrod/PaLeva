import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useEditDishPortion } from './useEditDishPortion'
import { ownerApi } from '../../../../shared/services/api'
import { useDishPortion } from './useDishPortion'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    updatePortion: vi.fn(),
  },
}))

vi.mock('./useDishPortion', () => ({
  useDishPortion: vi.fn(),
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useEditDishPortion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDishPortion).mockReturnValue({
      portion: { id: 7, description: 'Media', price: 12.5 },
      loading: false,
      error: null,
    } as any)
  })

  it('prefills form from loaded portion', async () => {
    // Arrange / Act
    const { result } = renderHook(() =>
      useEditDishPortion({ establishmentCode: 'est-1', dishId: 10, portionId: 7 })
    )

    // Assert
    await waitFor(() => {
      expect(result.current.formData.description).toBe('Media')
      expect(result.current.formData.price).toBe('12.5')
    })
  })

  it('submits update payload and navigates on success', async () => {
    // Arrange
    const onSuccess = vi.fn()
    vi.mocked(ownerApi.updatePortion).mockResolvedValue({ data: { portion: { id: 7 } } } as any)
    const { result } = renderHook(() =>
      useEditDishPortion({ establishmentCode: 'est-1', dishId: 10, portionId: 7, onSuccess })
    )
    act(() => {
      result.current.handleChange({ target: { name: 'description', value: '  Grande  ' } } as any)
      result.current.handleChange({ target: { name: 'price', value: '18.0' } } as any)
    })

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(ownerApi.updatePortion).toHaveBeenCalledWith('est-1', 10, 7, {
      description: 'Grande',
      price: 18,
    })
    expect(onSuccess).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/establishment/est-1/dishes/10/portions')
  })
})
