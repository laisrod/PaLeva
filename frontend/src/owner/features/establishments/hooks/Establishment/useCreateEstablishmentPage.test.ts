import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCreateEstablishmentPage } from './useCreateEstablishmentPage'
import { useCreateEstablishment } from './useCreateEstablishment'
import { useRequireNewEstablishment } from './useRequireNewEstablishment'

vi.mock('./useCreateEstablishment', () => ({
  useCreateEstablishment: vi.fn(),
}))

vi.mock('./useRequireNewEstablishment', () => ({
  useRequireNewEstablishment: vi.fn(),
}))

describe('useCreateEstablishmentPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('combines auth loading with create establishment hook state', () => {
    // Arrange
    vi.mocked(useRequireNewEstablishment).mockReturnValue({ loading: true } as any)
    vi.mocked(useCreateEstablishment).mockReturnValue({
      formData: { name: 'Paleva' },
      errors: [],
      loading: false,
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      setErrors: vi.fn(),
    } as any)

    // Act
    const { result } = renderHook(() => useCreateEstablishmentPage())

    // Assert
    expect(useRequireNewEstablishment).toHaveBeenCalled()
    expect(useCreateEstablishment).toHaveBeenCalled()
    expect(result.current.authLoading).toBe(true)
    expect(result.current.formData).toEqual({ name: 'Paleva' })
  })
})
