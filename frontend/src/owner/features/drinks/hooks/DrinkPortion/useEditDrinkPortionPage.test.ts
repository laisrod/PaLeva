import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useEditDrinkPortionPage } from './useEditDrinkPortionPage'
import { useEditDrinkPortion } from './useEditDrinkPortion'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useEditDrinkPortion', () => ({
  useEditDrinkPortion: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

describe('useEditDrinkPortionPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1', id: '22', portionId: '5' } as any)
  })

  it('checks owner auth and delegates to useEditDrinkPortion with parsed params', () => {
    // Arrange
    vi.mocked(useEditDrinkPortion).mockReturnValue({
      formData: { description: '', price: '' },
      loading: false,
    } as any)

    // Act
    const { result } = renderHook(() => useEditDrinkPortionPage())

    // Assert
    expect(useRequireOwner).toHaveBeenCalled()
    expect(useEditDrinkPortion).toHaveBeenCalledWith({
      establishmentCode: 'est-1',
      drinkId: 22,
      portionId: 5,
    })
    expect(result.current.establishmentCode).toBe('est-1')
    expect(result.current.drinkId).toBe('22')
    expect(result.current.portionId).toBe('5')
  })
})
