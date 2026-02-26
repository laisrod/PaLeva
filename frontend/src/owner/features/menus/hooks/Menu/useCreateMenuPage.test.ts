import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCreateMenuPage } from './useCreateMenuPage'
import { useCreateMenu } from './useCreateMenu'
import { useAuthCheck } from '../../../../shared/hooks/useAuthCheck'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('./useCreateMenu', () => ({
  useCreateMenu: vi.fn(),
}))

vi.mock('../../../../shared/hooks/useAuthCheck', () => ({
  useAuthCheck: vi.fn(),
}))

describe('useCreateMenuPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-9' } as any)
  })

  it('runs auth check and returns create menu state with establishment code', () => {
    // Arrange
    vi.mocked(useCreateMenu).mockReturnValue({
      formData: { name: '' },
      handleSubmit: vi.fn(),
      loading: false,
    } as any)

    // Act
    const { result } = renderHook(() => useCreateMenuPage())

    // Assert
    expect(useAuthCheck).toHaveBeenCalled()
    expect(useCreateMenu).toHaveBeenCalledWith({ establishmentCode: 'est-9' })
    expect(result.current.establishmentCode).toBe('est-9')
    expect(result.current.loading).toBe(false)
  })
})
