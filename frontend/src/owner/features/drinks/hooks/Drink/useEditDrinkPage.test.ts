import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useEditDrinkPage } from './useEditDrinkPage'
import { useEditDrink } from './useEditDrink'
import { useDrinkPortions } from '../DrinkPortion/useDrinkPortions'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useEditDrink', () => ({
  useEditDrink: vi.fn(),
}))

vi.mock('../DrinkPortion/useDrinkPortions', () => ({
  useDrinkPortions: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

describe('useEditDrinkPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1', id: '22' } as any)
  })

  it('checks owner auth and composes edit + portions hooks with parsed drink id', () => {
    // Arrange
    vi.mocked(useEditDrink).mockReturnValue({
      formData: { name: 'Suco' },
      loading: false,
    } as any)
    vi.mocked(useDrinkPortions).mockReturnValue({
      portions: [{ id: 1, description: 'Grande' }],
      loading: false,
    } as any)

    // Act
    const { result } = renderHook(() => useEditDrinkPage())

    // Assert
    expect(useRequireOwner).toHaveBeenCalled()
    expect(useEditDrink).toHaveBeenCalledWith({ drinkId: 22, establishmentCode: 'est-1' })
    expect(useDrinkPortions).toHaveBeenCalledWith('est-1', 22)
    expect(result.current.drinkId).toBe('22')
    expect(result.current.portions).toEqual([{ id: 1, description: 'Grande' }])
  })
})
