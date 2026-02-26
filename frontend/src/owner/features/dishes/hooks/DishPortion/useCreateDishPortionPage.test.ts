import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCreateDishPortionPage } from './useCreateDishPortionPage'
import { useCreateDishPortion } from './useCreateDishPortion'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useCreateDishPortion', () => ({
  useCreateDishPortion: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

describe('useCreateDishPortionPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1', id: '22' } as any)
  })

  it('checks owner auth and delegates to useCreateDishPortion with parsed params', () => {
    // Arrange
    vi.mocked(useCreateDishPortion).mockReturnValue({
      formData: { description: '', price: '' },
      loading: false,
    } as any)

    // Act
    const { result } = renderHook(() => useCreateDishPortionPage())

    // Assert
    expect(useRequireOwner).toHaveBeenCalled()
    expect(useCreateDishPortion).toHaveBeenCalledWith({
      establishmentCode: 'est-1',
      dishId: 22,
    })
    expect(result.current.establishmentCode).toBe('est-1')
    expect(result.current.dishId).toBe('22')
  })
})
