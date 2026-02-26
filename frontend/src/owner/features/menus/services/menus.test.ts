import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MenusApi } from './menus'

describe('MenusApi', () => {
  let api: MenusApi
  let requestSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    api = new MenusApi()
    requestSpy = vi.spyOn(api as any, 'request').mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('gets menus from establishment endpoint', async () => {
    // Arrange / Act
    await api.getMenus('est-1')

    // Assert
    expect(requestSpy).toHaveBeenCalledWith('/establishments/est-1/menus')
  })

  it('creates menu with wrapped menu payload', async () => {
    // Arrange
    const menuData = { name: 'Executivo', description: 'Almoco' }

    // Act
    await api.createMenu('est-1', menuData as any)

    // Assert
    expect(requestSpy).toHaveBeenCalledWith(
      '/establishments/est-1/menus',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ menu: menuData }),
      })
    )
  })

  it('updates menu item portions with correct payload', async () => {
    // Arrange / Act
    await api.updateMenuItem('est-1', 10, 20, [1, 2, 3])

    // Assert
    expect(requestSpy).toHaveBeenCalledWith(
      '/establishments/est-1/menus/10/menu_items/20',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ menu_item: { portion_ids: [1, 2, 3] } }),
      })
    )
  })
})
