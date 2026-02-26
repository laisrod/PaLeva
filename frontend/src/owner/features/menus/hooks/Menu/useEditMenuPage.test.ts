import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useEditMenuPage } from './useEditMenuPage'
import { useEditMenu } from './useEditMenu'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useEditMenu', () => ({
  useEditMenu: vi.fn(),
}))

describe('useEditMenuPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-5', id: '12' } as any)
  })

  it('parses menu id param and delegates to useEditMenu', () => {
    // Arrange
    const editState = { formData: { name: 'Menu' }, loading: false }
    vi.mocked(useEditMenu).mockReturnValue(editState as any)

    // Act
    const { result } = renderHook(() => useEditMenuPage())

    // Assert
    expect(useEditMenu).toHaveBeenCalledWith({
      menuId: 12,
      establishmentCode: 'est-5',
    })
    expect(result.current.establishmentCode).toBe('est-5')
    expect(result.current.menuId).toBe('12')
    expect(result.current.loading).toBe(false)
  })
})
