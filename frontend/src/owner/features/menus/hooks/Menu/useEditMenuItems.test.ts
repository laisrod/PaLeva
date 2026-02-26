import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEditMenuItems } from './useEditMenuItems'
import { useMenuItems } from './useMenuItems'
import { useMenuItemsManagement } from './useMenuItemsManagement'

vi.mock('./useMenuItems', () => ({
  useMenuItems: vi.fn(),
}))

vi.mock('./useMenuItemsManagement', () => ({
  useMenuItemsManagement: vi.fn(),
}))

describe('useEditMenuItems', () => {
  const removeMenuItem = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('confirm', vi.fn(() => true))
    vi.mocked(useMenuItems).mockReturnValue({
      menuItems: [{ id: 1, dish: { id: 9, name: 'Prato' } }],
      loading: false,
      refetch: vi.fn(),
    } as any)
    vi.mocked(useMenuItemsManagement).mockReturnValue({
      removeMenuItem,
      loading: false,
    } as any)
  })

  it('asks confirmation and removes selected menu item', async () => {
    // Arrange
    const { result } = renderHook(() =>
      useEditMenuItems({ menuId: 10, establishmentCode: 'est-1' })
    )

    // Act
    await act(async () => {
      await result.current.handleRemoveItem(1)
    })

    // Assert
    expect(removeMenuItem).toHaveBeenCalledWith(1)
  })

  it('opens and closes manage portions modal state', () => {
    // Arrange
    const { result } = renderHook(() =>
      useEditMenuItems({ menuId: 10, establishmentCode: 'est-1' })
    )

    // Act
    act(() => {
      result.current.handleManagePortions({
        id: 1,
        dish: { id: 9, name: 'Prato Executivo' },
      })
    })

    // Assert
    expect(result.current.managingPortions).toEqual({
      menuItemId: 1,
      productId: 9,
      isDish: true,
      productName: 'Prato Executivo',
    })

    act(() => {
      result.current.handleCloseManagePortions()
    })
    expect(result.current.managingPortions).toBeNull()
  })
})
