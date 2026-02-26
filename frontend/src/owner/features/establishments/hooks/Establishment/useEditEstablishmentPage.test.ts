import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useEditEstablishmentPage } from './useEditEstablishmentPage'
import { useEditEstablishment } from './useEditEstablishment'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useEditEstablishment', () => ({
  useEditEstablishment: vi.fn(),
}))

describe('useEditEstablishmentPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-55' } as any)
  })

  it('passes route code to useEditEstablishment and returns its result', () => {
    // Arrange
    const expected = {
      formData: { name: 'Paleva' },
      handleSubmit: vi.fn(),
      loading: false,
    }
    vi.mocked(useEditEstablishment).mockReturnValue(expected as any)

    // Act
    const { result } = renderHook(() => useEditEstablishmentPage())

    // Assert
    expect(useEditEstablishment).toHaveBeenCalledWith('est-55')
    expect(result.current).toBe(expected)
  })
})
