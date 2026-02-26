import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDishPortionsPage } from './useDishPortionsPage'
import { useDishPortions } from './useDishPortions'
import { useDeleteDishPortion } from './useDeleteDishPortion'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'
import { useAuth } from '../../../../../shared/hooks/useAuth'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useDishPortions', () => ({
  useDishPortions: vi.fn(),
}))

vi.mock('./useDeleteDishPortion', () => ({
  useDeleteDishPortion: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('useDishPortionsPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1', id: '22' } as any)
    vi.mocked(useAuth).mockReturnValue({ isOwner: true } as any)
  })

  it('composes listing/deleting hooks and exposes owner + params info', () => {
    // Arrange
    const refetch = vi.fn()
    const deletePortion = vi.fn()
    vi.mocked(useDishPortions).mockReturnValue({
      portions: [{ id: 1, description: 'Media' }],
      loading: false,
      error: null,
      refetch,
    } as any)
    vi.mocked(useDeleteDishPortion).mockReturnValue({
      deletePortion,
      loading: false,
      error: null,
    } as any)

    // Act
    const { result } = renderHook(() => useDishPortionsPage())

    // Assert
    expect(useRequireOwner).toHaveBeenCalled()
    expect(useDishPortions).toHaveBeenCalledWith('est-1', 22)
    expect(useDeleteDishPortion).toHaveBeenCalled()
    expect(result.current.isOwner).toBe(true)
    expect(result.current.establishmentCode).toBe('est-1')
    expect(result.current.dishId).toBe('22')
    expect(result.current.portions).toEqual([{ id: 1, description: 'Media' }])
    expect(result.current.deletePortion).toBe(deletePortion)
  })
})
