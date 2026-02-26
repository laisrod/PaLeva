import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCreateDrinkPage } from './useCreateDrinkPage'
import { useCreateDrink } from './useCreateDrink'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useCreateDrink', () => ({
  useCreateDrink: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

describe('useCreateDrinkPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1' } as any)
  })

  it('checks owner auth and delegates to create hook with route code', () => {
    // Arrange
    vi.mocked(useCreateDrink).mockReturnValue({
      formData: { name: '', description: '' },
      loading: false,
    } as any)

    // Act
    const { result } = renderHook(() => useCreateDrinkPage())

    // Assert
    expect(useRequireOwner).toHaveBeenCalled()
    expect(useCreateDrink).toHaveBeenCalledWith({ establishmentCode: 'est-1' })
    expect(result.current.establishmentCode).toBe('est-1')
  })
})
