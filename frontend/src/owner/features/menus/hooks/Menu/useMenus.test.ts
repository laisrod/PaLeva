import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useMenus } from './useMenus'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getMenus: vi.fn(),
    deleteMenu: vi.fn(),
  },
}))

describe('useMenus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('confirm', vi.fn(() => true))
    vi.stubGlobal('alert', vi.fn())
  })

  it('loads menus when establishment code exists', async () => {
    // Arrange
    const menus = [{ id: 1, name: 'Executivo', description: 'Almoco' }]
    vi.mocked(ownerApi.getMenus).mockResolvedValue({ data: menus } as any)

    // Act
    const { result } = renderHook(() => useMenus('est-1'))

    // Assert
    await waitFor(() => {
      expect(result.current.menus).toEqual(menus)
    })
    expect(ownerApi.getMenus).toHaveBeenCalledWith('est-1')
  })

  it('deletes menu after user confirmation and updates local state', async () => {
    // Arrange
    vi.mocked(ownerApi.getMenus).mockResolvedValue({
      data: [
        { id: 1, name: 'A', description: 'a' },
        { id: 2, name: 'B', description: 'b' },
      ],
    } as any)
    vi.mocked(ownerApi.deleteMenu).mockResolvedValue({ data: { ok: true } } as any)
    const { result } = renderHook(() => useMenus('est-1'))
    await waitFor(() => expect(result.current.menus).toHaveLength(2))

    // Act
    await act(async () => {
      await result.current.deleteMenu(1)
    })

    // Assert
    expect(confirm).toHaveBeenCalled()
    expect(ownerApi.deleteMenu).toHaveBeenCalledWith('est-1', 1)
    expect(result.current.menus).toEqual([{ id: 2, name: 'B', description: 'b' }])
  })

  it('shows API error on delete failure response', async () => {
    // Arrange
    vi.mocked(ownerApi.getMenus).mockResolvedValue({ data: [] } as any)
    vi.mocked(ownerApi.deleteMenu).mockResolvedValue({ error: 'Nao pode excluir' } as any)
    const { result } = renderHook(() => useMenus('est-1'))
    await waitFor(() => expect(ownerApi.getMenus).toHaveBeenCalled())

    // Act
    await act(async () => {
      await result.current.deleteMenu(10)
    })

    // Assert
    expect(alert).toHaveBeenCalledWith('Nao pode excluir')
  })
})
