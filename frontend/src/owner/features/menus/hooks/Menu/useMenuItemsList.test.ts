import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMenuItemsList } from './useMenuItemsList'

describe('useMenuItemsList', () => {
  it('selects item + portion and sends payload with quantity', () => {
    // Arrange
    const onSelectItem = vi.fn()
    const { result } = renderHook(() => useMenuItemsList({ onSelectItem } as any))

    // Act
    act(() => {
      result.current.handleItemClick(10)
      result.current.handlePortionClick(20)
      result.current.handleQuantityChange(3)
    })
    act(() => {
      result.current.handleAddToOrder()
    })

    // Assert
    expect(onSelectItem).toHaveBeenCalledWith(10, 20, 3)
    expect(result.current.selectedMenuItem).toBeNull()
    expect(result.current.selectedPortion).toBeNull()
    expect(result.current.quantity).toBe(1)
  })

  it('keeps quantity at minimum 1', () => {
    // Arrange
    const { result } = renderHook(() => useMenuItemsList({ onSelectItem: vi.fn() } as any))

    // Act
    act(() => {
      result.current.handleQuantityChange(0)
    })

    // Assert
    expect(result.current.quantity).toBe(1)
  })
})
