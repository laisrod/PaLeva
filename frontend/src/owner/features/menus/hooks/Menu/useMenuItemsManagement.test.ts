import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMenuItemsManagement } from './useMenuItemsManagement'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    menus: {
      createMenuItem: vi.fn(),
      deleteMenuItem: vi.fn(),
    },
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useMenuItemsManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns validation error when dish and drink are both missing', async () => {
    // Arrange
    const { result } = renderHook(() =>
      useMenuItemsManagement({ establishmentCode: 'est-1', menuId: 10 })
    )

    // Act
    let success = true
    await act(async () => {
      success = await result.current.addMenuItem()
    })

    // Assert
    expect(success).toBe(false)
    expect(result.current.error).toBe('É necessário informar um prato ou uma bebida')
  })

  it('adds menu item and calls onSuccess on successful response', async () => {
    // Arrange
    const onSuccess = vi.fn()
    vi.mocked(ownerApi.menus.createMenuItem).mockResolvedValue({ data: { menu_item: { id: 1 } } } as any)
    const { result } = renderHook(() =>
      useMenuItemsManagement({ establishmentCode: 'est-1', menuId: 10, onSuccess })
    )

    // Act
    let success = false
    await act(async () => {
      success = await result.current.addMenuItem(20, undefined)
    })

    // Assert
    expect(success).toBe(true)
    expect(ownerApi.menus.createMenuItem).toHaveBeenCalledWith('est-1', 10, {
      dish_id: 20,
      drink_id: undefined,
    })
    expect(onSuccess).toHaveBeenCalled()
  })

  it('returns false and sets error when remove fails', async () => {
    // Arrange
    vi.mocked(ownerApi.menus.deleteMenuItem).mockResolvedValue({ error: 'Falha ao remover' } as any)
    const { result } = renderHook(() =>
      useMenuItemsManagement({ establishmentCode: 'est-1', menuId: 10 })
    )

    // Act
    let success = true
    await act(async () => {
      success = await result.current.removeMenuItem(99)
    })

    // Assert
    expect(success).toBe(false)
    expect(result.current.error).toBe('Falha ao remover')
  })
})
