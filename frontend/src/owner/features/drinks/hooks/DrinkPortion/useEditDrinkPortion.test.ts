import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useEditDrinkPortion } from './useEditDrinkPortion'
import { ownerApi } from '../../../../shared/services/api'
import { useDrinkPortion } from './useDrinkPortion'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    updateDrinkPortion: vi.fn(),
  },
}))

vi.mock('./useDrinkPortion', () => ({
  useDrinkPortion: vi.fn(),
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useEditDrinkPortion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDrinkPortion).mockReturnValue({
      portion: { id: 7, description: 'Media', price: 12.5 },
      loading: false,
      error: null,
    } as any)
  })

  it('prefills form from loaded portion', async () => {
    // Arrange / Act
    const { result } = renderHook(() =>
      useEditDrinkPortion({ establishmentCode: 'est-1', drinkId: 10, portionId: 7 })
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
    vi.mocked(ownerApi.updateDrinkPortion).mockResolvedValue({ data: { portion: { id: 7 } } } as any)
    const { result } = renderHook(() =>
      useEditDrinkPortion({ establishmentCode: 'est-1', drinkId: 10, portionId: 7, onSuccess })
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
    expect(ownerApi.updateDrinkPortion).toHaveBeenCalledWith('est-1', 10, 7, {
      description: 'Grande',
      price: 18,
    })
    expect(onSuccess).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/establishment/est-1/drinks/10/portions')
  })
})
