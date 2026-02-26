import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useEditDishPortionPage } from './useEditDishPortionPage'
import { useEditDishPortion } from './useEditDishPortion'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useEditDishPortion', () => ({
  useEditDishPortion: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

describe('useEditDishPortionPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1', id: '22', portionId: '5' } as any)
  })

  it('checks owner auth and delegates to useEditDishPortion with parsed params', () => {
    // Arrange
    vi.mocked(useEditDishPortion).mockReturnValue({
      formData: { description: '', price: '' },
      loading: false,
    } as any)

    // Act
    const { result } = renderHook(() => useEditDishPortionPage())

    // Assert
    expect(useRequireOwner).toHaveBeenCalled()
    expect(useEditDishPortion).toHaveBeenCalledWith({
      establishmentCode: 'est-1',
      dishId: 22,
      portionId: 5,
    })
    expect(result.current.establishmentCode).toBe('est-1')
    expect(result.current.dishId).toBe('22')
    expect(result.current.portionId).toBe('5')
  })
})
