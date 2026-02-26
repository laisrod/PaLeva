import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMenusPage } from './useMenusPage'
import { useMenus } from './useMenus'
import { useAuth } from '../../../../../shared/hooks/useAuth'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useMenus', () => ({
  useMenus: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

describe('useMenusPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1' } as any)
    vi.mocked(useAuth).mockReturnValue({ isOwner: true } as any)
  })

  it('checks owner access and exposes menus listing state', () => {
    // Arrange
    const deleteMenu = vi.fn()
    vi.mocked(useMenus).mockReturnValue({
      menus: [{ id: 1, name: 'Executivo' }],
      loading: false,
      error: null,
      deleteMenu,
    } as any)

    // Act
    const { result } = renderHook(() => useMenusPage())

    // Assert
    expect(useRequireOwner).toHaveBeenCalled()
    expect(useMenus).toHaveBeenCalledWith('est-1')
    expect(result.current.establishmentCode).toBe('est-1')
    expect(result.current.isOwner).toBe(true)
    expect(result.current.deleteMenu).toBe(deleteMenu)
  })
})
