import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTestCreateOrderPage } from './useTestCreateOrderPage'
import { useCurrentOrder } from './useCurrentOrder'
import { useAddOrderItem } from './useAddOrderItem'
import { useMenus } from '../../../menus/hooks/Menu/useMenus'
import { useMenuItems } from '../../../menus/hooks/Menu/useMenuItems'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

vi.mock('./useCurrentOrder', () => ({
  useCurrentOrder: vi.fn(),
}))

vi.mock('./useAddOrderItem', () => ({
  useAddOrderItem: vi.fn(),
}))

vi.mock('../../../menus/hooks/Menu/useMenus', () => ({
  useMenus: vi.fn(),
}))

vi.mock('../../../menus/hooks/Menu/useMenuItems', () => ({
  useMenuItems: vi.fn(),
}))

describe('useTestCreateOrderPage', () => {
  const createNewOrder = vi.fn()
  const clearOrder = vi.fn()
  const loadOrder = vi.fn()
  const addItem = vi.fn()

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1' } as any)

    vi.mocked(useCurrentOrder).mockReturnValue({
      currentOrder: { code: 'ORD-1' },
      loading: false,
      error: null,
      createNewOrder,
      clearOrder,
      loadOrder,
      totals: { subtotal: 10, serviceFee: 0.5, tax: 1, total: 11.5 },
      itemsCount: 1,
    } as any)

    vi.mocked(useMenus).mockReturnValue({
      menus: [{ id: 10, name: 'Almoco' }],
      loading: false,
    } as any)

    vi.mocked(useMenuItems).mockReturnValue({
      menuItems: [{ id: 100, name: 'Prato do dia' }],
      loading: false,
    } as any)

    vi.mocked(useAddOrderItem).mockReturnValue({
      addItem,
      loading: false,
      error: null,
    } as any)
  })

  it('creates draft order with default customer and forwards selected item to addItem', async () => {
    // Arrange
    const { result } = renderHook(() => useTestCreateOrderPage())

    // Act
    await act(async () => {
      await result.current.handleCreateOrder()
      await result.current.handleSelectItem(100, 200, 2)
    })

    // Assert
    expect(createNewOrder).toHaveBeenCalledWith('Cliente Teste')
    expect(addItem).toHaveBeenCalledWith({ menuItemId: 100, portionId: 200, quantity: 2 })
  })

  it('exposes menus/menuItems and allows selecting menu id', () => {
    // Arrange
    const { result } = renderHook(() => useTestCreateOrderPage())

    // Act
    act(() => {
      result.current.setSelectedMenuId(10)
    })

    // Assert
    expect(result.current.selectedMenuId).toBe(10)
    expect(result.current.menus).toEqual([{ id: 10, name: 'Almoco' }])
    expect(result.current.menuItems).toEqual([{ id: 100, name: 'Prato do dia' }])
  })
})
