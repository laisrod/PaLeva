import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useManageMenuItemPortions } from './useManageMenuItemPortions'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    portions: { getPortions: vi.fn() },
    getDrinkPortions: vi.fn(),
    getMenu: vi.fn(),
    updateMenuItem: vi.fn(),
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useManageMenuItemPortions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads available portions and selected portions from menu item', async () => {
    // Arrange
    vi.mocked(ownerApi.portions.getPortions).mockResolvedValue({
      data: [{ id: 1, description: 'Pequena' }, { id: 2, description: 'Grande' }],
    } as any)
    vi.mocked(ownerApi.getMenu).mockResolvedValue({
      data: { menu_items: [{ id: 20, dish: { portions: [{ id: 2 }] } }] },
    } as any)

    // Act
    const { result } = renderHook(() =>
      useManageMenuItemPortions({
        establishmentCode: 'est-1',
        menuId: 10,
        menuItemId: 20,
        productId: 30,
        isDish: true,
      })
    )

    // Assert
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.portions.length).toBe(2)
      expect(result.current.selectedPortions).toEqual([2])
    })
  })

  it('validates at least one selected portion before save', async () => {
    // Arrange
    vi.mocked(ownerApi.portions.getPortions).mockResolvedValue({ data: [] } as any)
    vi.mocked(ownerApi.getMenu).mockResolvedValue({ data: { menu_items: [] } } as any)
    const { result } = renderHook(() =>
      useManageMenuItemPortions({
        establishmentCode: 'est-1',
        menuId: 10,
        menuItemId: 20,
        productId: 30,
        isDish: true,
      })
    )
    await waitFor(() => expect(result.current.loading).toBe(false))

    // Act
    let ok = true
    await act(async () => {
      ok = await result.current.handleSave()
    })

    // Assert
    expect(ok).toBe(false)
    expect(result.current.error).toBe('Selecione pelo menos uma porção')
    expect(ownerApi.updateMenuItem).not.toHaveBeenCalled()
  })
})
