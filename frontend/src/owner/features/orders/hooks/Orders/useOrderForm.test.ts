import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useOrderForm } from './useOrderForm'

describe('useOrderForm', () => {
  it('enables create mode after creating a new order', async () => {
    // Arrange
    const createNewOrder = vi.fn().mockResolvedValue({ code: 'ORD-1' })
    const { result } = renderHook(() => useOrderForm())

    // Act
    await act(async () => {
      await result.current.handleCreateOrder(createNewOrder)
    })

    // Assert
    expect(createNewOrder).toHaveBeenCalled()
    expect(result.current.showCreateOrder).toBe(true)
  })

  it('toggles selected dish and selected drink', () => {
    // Arrange
    const { result } = renderHook(() => useOrderForm())

    // Act
    act(() => {
      result.current.handleToggleDish(10)
      result.current.handleToggleDrink(20)
    })

    // Assert
    expect(result.current.selectedDishId).toBe(10)
    expect(result.current.selectedDrinkId).toBe(20)

    // Act (toggle off)
    act(() => {
      result.current.handleToggleDish(10)
      result.current.handleToggleDrink(20)
    })

    // Assert
    expect(result.current.selectedDishId).toBeUndefined()
    expect(result.current.selectedDrinkId).toBeUndefined()
  })

  it('adds dish portion and clears selected dish', async () => {
    // Arrange
    const addItem = vi.fn().mockResolvedValue(true)
    const { result } = renderHook(() => useOrderForm())
    act(() => result.current.handleToggleDish(10))

    // Act
    await act(async () => {
      await result.current.handleSelectDishPortion(10, 3, 2, addItem)
    })

    // Assert
    expect(addItem).toHaveBeenCalledWith({ dishId: 10, portionId: 3, quantity: 2 })
    expect(result.current.selectedDishId).toBeUndefined()
  })

  it('resets form state when clearing order', async () => {
    // Arrange
    const { result } = renderHook(() => useOrderForm())
    const createNewOrder = vi.fn().mockResolvedValue({ code: 'ORD-2' })
    await act(async () => {
      await result.current.handleCreateOrder(createNewOrder)
    })
    act(() => {
      result.current.handleSelectMenu(5)
      result.current.handleToggleDrink(12)
    })

    // Act
    act(() => {
      result.current.handleClearOrder()
    })

    // Assert
    expect(result.current.showCreateOrder).toBe(false)
    expect(result.current.selectedMenuId).toBeUndefined()
    expect(result.current.selectedDrinkId).toBeUndefined()
  })
})
