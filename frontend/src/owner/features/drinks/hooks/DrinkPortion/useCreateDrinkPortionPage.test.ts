import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCreateDrinkPortionPage } from './useCreateDrinkPortionPage'
import { useCreateDrinkPortion } from './useCreateDrinkPortion'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useCreateDrinkPortion', () => ({
  useCreateDrinkPortion: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

describe('useCreateDrinkPortionPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1', id: '22' } as any)
  })

  it('checks owner auth and delegates to useCreateDrinkPortion with parsed params', () => {
    // Arrange
    vi.mocked(useCreateDrinkPortion).mockReturnValue({
      formData: { description: '', price: '' },
      loading: false,
    } as any)

    // Act
    const { result } = renderHook(() => useCreateDrinkPortionPage())

    // Assert
    expect(useRequireOwner).toHaveBeenCalled()
    expect(useCreateDrinkPortion).toHaveBeenCalledWith({
      establishmentCode: 'est-1',
      drinkId: 22,
    })
    expect(result.current.establishmentCode).toBe('est-1')
    expect(result.current.drinkId).toBe('22')
  })
})
