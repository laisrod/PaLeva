import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useAddMenuItems } from './useAddMenuItems'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getDishes: vi.fn(),
    getDrinks: vi.fn(),
    createMenuItem: vi.fn(),
    getDrinkPortions: vi.fn(),
    portions: { getPortions: vi.fn() },
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useAddMenuItems', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(ownerApi.getDishes).mockResolvedValue({
      data: [{ id: 1, name: 'Feijoada' }],
    } as any)
    vi.mocked(ownerApi.getDrinks).mockResolvedValue({
      data: [{ id: 2, name: 'Suco' }],
    } as any)
  })

  it('loads dishes and drinks and detects existing item in menu', async () => {
    // Arrange
    const { result } = renderHook(() =>
      useAddMenuItems({
        establishmentCode: 'est-1',
        menuId: 10,
        onItemAdded: vi.fn(),
        existingItems: [{ dish: { id: 1 } }],
      } as any)
    )

    // Act / Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.dishes).toEqual([{ id: 1, name: 'Feijoada' }])
      expect(result.current.drinks).toEqual([{ id: 2, name: 'Suco' }])
    })
    expect(result.current.isItemInMenu(1, true)).toBe(true)
    expect(result.current.isItemInMenu(2, false)).toBe(false)
  })

  it('opens portion modal when item has portions to choose', async () => {
    // Arrange
    vi.mocked(ownerApi.portions.getPortions).mockResolvedValue({
      data: [{ id: 11, description: 'Grande' }],
    } as any)
    const { result } = renderHook(() =>
      useAddMenuItems({
        establishmentCode: 'est-1',
        menuId: 10,
        onItemAdded: vi.fn(),
        existingItems: [],
      } as any)
    )
    await waitFor(() => expect(result.current.loading).toBe(false))

    // Act
    await act(async () => {
      await result.current.handleAddItem(1, undefined)
    })

    // Assert
    expect(result.current.showPortionModal).toBe(true)
    expect(result.current.portions).toEqual([{ id: 11, description: 'Grande' }])
  })
})
