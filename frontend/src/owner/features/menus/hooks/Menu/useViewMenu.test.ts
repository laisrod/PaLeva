import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useViewMenu } from './useViewMenu'
import { useViewMenuPage } from './useViewMenuPage'
import { useMenuItems } from './useMenuItems'
import { useMenuItemsManagement } from './useMenuItemsManagement'

vi.mock('./useViewMenuPage', () => ({
  useViewMenuPage: vi.fn(),
}))

vi.mock('./useMenuItems', () => ({
  useMenuItems: vi.fn(),
}))

vi.mock('./useMenuItemsManagement', () => ({
  useMenuItemsManagement: vi.fn(),
}))

describe('useViewMenu', () => {
  const removeMenuItem = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('confirm', vi.fn(() => true))
    vi.mocked(useViewMenuPage).mockReturnValue({
      establishmentCode: 'est-1',
      menuId: '10',
      menuData: { id: 10, name: 'Executivo' },
      loading: false,
      error: null,
    } as any)
    vi.mocked(useMenuItems).mockReturnValue({
      menuItems: [{ id: 1, dish: { id: 7 } }],
      loading: false,
      refetch: vi.fn(),
    } as any)
    vi.mocked(useMenuItemsManagement).mockReturnValue({
      removeMenuItem,
      loading: false,
    } as any)
  })

  it('composes menu details and items hooks', () => {
    // Arrange / Act
    const { result } = renderHook(() => useViewMenu())

    // Assert
    expect(useMenuItems).toHaveBeenCalledWith({ menuId: 10, establishmentCode: 'est-1' })
    expect(result.current.menuData).toEqual({ id: 10, name: 'Executivo' })
    expect(result.current.menuItems).toEqual([{ id: 1, dish: { id: 7 } }])
  })

  it('removes item after confirmation', async () => {
    // Arrange
    const { result } = renderHook(() => useViewMenu())

    // Act
    await act(async () => {
      await result.current.handleRemoveItem(1)
    })

    // Assert
    expect(removeMenuItem).toHaveBeenCalledWith(1)
  })
})
