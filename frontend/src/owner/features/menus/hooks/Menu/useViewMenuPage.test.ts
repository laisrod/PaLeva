import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useViewMenuPage } from './useViewMenuPage'
import { useMenu } from './useMenu'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useMenu', () => ({
  useMenu: vi.fn(),
}))

describe('useViewMenuPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1', id: '42' } as any)
  })

  it('parses route params and maps menu data for view', () => {
    // Arrange
    vi.mocked(useMenu).mockReturnValue({
      menu: { id: 42, name: 'Menu A', description: 'Descricao', price: 19.9 },
      loading: false,
      error: null,
    } as any)

    // Act
    const { result } = renderHook(() => useViewMenuPage())

    // Assert
    expect(useMenu).toHaveBeenCalledWith({ menuId: 42, establishmentCode: 'est-1' })
    expect(result.current.establishmentCode).toBe('est-1')
    expect(result.current.menuId).toBe('42')
    expect(result.current.menuData).toEqual({
      id: 42,
      name: 'Menu A',
      description: 'Descricao',
      price: 19.9,
      items: [],
    })
  })
})
