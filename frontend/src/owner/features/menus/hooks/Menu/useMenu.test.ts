import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMenu } from './useMenu'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getMenu: vi.fn(),
  },
}))

describe('useMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads menu details and maps fields into menu state', async () => {
    // Arrange
    vi.mocked(ownerApi.getMenu).mockResolvedValue({
      data: {
        id: 10,
        name: 'Menu Especial',
        description: 'Descricao',
        price: 29.9,
      },
    } as any)

    // Act
    const { result } = renderHook(() =>
      useMenu({ menuId: 10, establishmentCode: 'est-1' })
    )

    // Assert
    await waitFor(() => {
      expect(result.current.menu).toEqual({
        id: 10,
        name: 'Menu Especial',
        description: 'Descricao',
        price: 29.9,
      })
    })
    expect(ownerApi.getMenu).toHaveBeenCalledWith('est-1', 10)
  })

  it('does not request menu when menuId or establishmentCode is missing', async () => {
    // Arrange / Act
    renderHook(() => useMenu({ menuId: undefined, establishmentCode: 'est-1' }))
    renderHook(() => useMenu({ menuId: 10, establishmentCode: undefined }))

    // Assert
    await waitFor(() => {
      expect(ownerApi.getMenu).not.toHaveBeenCalled()
    })
  })
})
