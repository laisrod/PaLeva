import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDrinkCard } from './useDrinkCard'
import { useCurrentOrder } from '../../../orders/hooks/Orders/useCurrentOrder'
import { useAddOrderItem } from '../../../orders/hooks/Orders/useAddOrderItem'
import { useDrinkPortions } from '../DrinkPortion/useDrinkPortions'

vi.mock('../../../orders/hooks/Orders/useCurrentOrder', () => ({
  useCurrentOrder: vi.fn(),
}))

vi.mock('../../../orders/hooks/Orders/useAddOrderItem', () => ({
  useAddOrderItem: vi.fn(),
}))

vi.mock('../DrinkPortion/useDrinkPortions', () => ({
  useDrinkPortions: vi.fn(),
}))

describe('useDrinkCard', () => {
  const createNewOrder = vi.fn()
  const loadOrder = vi.fn()
  const addItem = vi.fn()
  const alertMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('alert', alertMock)

    vi.mocked(useCurrentOrder).mockReturnValue({
      currentOrder: null,
      createNewOrder,
      loadOrder,
    } as any)

    vi.mocked(useAddOrderItem).mockReturnValue({
      addItem,
      loading: false,
      error: null,
    } as any)

    vi.mocked(useDrinkPortions).mockReturnValue({
      portions: [],
      loading: false,
    } as any)
  })

  it('shows alert when drink has no portions registered', async () => {
    // Arrange
    const { result } = renderHook(() =>
      useDrinkCard({ drink: { id: 10, name: 'Suco' } as any, establishmentCode: 'est-1' })
    )

    // Act
    await act(async () => {
      await result.current.handleAddToOrder()
    })

    // Assert
    expect(alertMock).toHaveBeenCalledWith(
      'Esta bebida não possui porções cadastradas. Por favor, adicione porções primeiro.'
    )
    expect(createNewOrder).not.toHaveBeenCalled()
  })

  it('adds single portion directly when there is a current order', async () => {
    // Arrange
    vi.mocked(useCurrentOrder).mockReturnValue({
      currentOrder: { code: 'ORD-123' },
      createNewOrder,
      loadOrder,
    } as any)
    vi.mocked(useDrinkPortions).mockReturnValue({
      portions: [{ id: 5, description: 'Grande', price: 12 }],
      loading: false,
    } as any)
    addItem.mockResolvedValue(true)

    const { result } = renderHook(() =>
      useDrinkCard({ drink: { id: 10, name: 'Suco' } as any, establishmentCode: 'est-1' })
    )

    // Act
    await act(async () => {
      await result.current.handleAddToOrder()
    })

    // Assert
    expect(addItem).toHaveBeenCalledWith({ drinkId: 10, portionId: 5, quantity: 1 })
  })

  it('opens portion modal when there are multiple portions and no current order', async () => {
    // Arrange
    vi.mocked(useDrinkPortions).mockReturnValue({
      portions: [
        { id: 1, description: 'Pequena' },
        { id: 2, description: 'Grande' },
      ],
      loading: false,
    } as any)
    const { result } = renderHook(() =>
      useDrinkCard({ drink: { id: 10, name: 'Suco' } as any, establishmentCode: 'est-1' })
    )

    // Act
    await act(async () => {
      await result.current.handleAddToOrder()
    })

    // Assert
    expect(result.current.showPortionModal).toBe(true)
    expect(createNewOrder).not.toHaveBeenCalled()
  })
})
