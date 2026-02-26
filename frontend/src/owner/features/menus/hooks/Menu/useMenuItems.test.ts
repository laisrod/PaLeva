import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useMenuItems } from './useMenuItems'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getMenu: vi.fn(),
  },
}))

describe('useMenuItems', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads menu items and menu name from menu response', async () => {
    // Arrange
    vi.mocked(ownerApi.getMenu).mockResolvedValue({
      data: {
        id: 5,
        name: 'Almoco',
        menu_items: [{ id: 1, dish: { id: 10, name: 'Prato' } }],
      },
    } as any)

    // Act
    const { result } = renderHook(() =>
      useMenuItems({ menuId: 5, establishmentCode: 'est-1' })
    )

    // Assert
    await waitFor(() => {
      expect(result.current.menuName).toBe('Almoco')
      expect(result.current.menuItems).toEqual([{ id: 1, dish: { id: 10, name: 'Prato' } }])
    })
  })

  it('refetch requests menu items again when params are available', async () => {
    // Arrange
    vi.mocked(ownerApi.getMenu).mockResolvedValue({ data: { id: 5, name: 'A', menu_items: [] } } as any)
    const { result } = renderHook(() =>
      useMenuItems({ menuId: 5, establishmentCode: 'est-1' })
    )
    await waitFor(() => expect(ownerApi.getMenu).toHaveBeenCalledTimes(1))

    // Act
    await act(async () => {
      result.current.refetch()
    })

    // Assert
    await waitFor(() => {
      expect(ownerApi.getMenu).toHaveBeenCalledTimes(2)
    })
  })
})
