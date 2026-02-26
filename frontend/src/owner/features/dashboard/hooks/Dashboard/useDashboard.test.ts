import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDashboard } from './useDashboard'
import { useAuth } from '../../../../../shared/hooks/useAuth'
import { useEstablishment } from '../../../establishments/hooks/Establishment/useEstablishment'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../../establishments/hooks/Establishment/useEstablishment', () => ({
  useEstablishment: vi.fn(),
}))

describe('useDashboard', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useParams } = await import('react-router-dom')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1' } as any)
    vi.mocked(useAuth).mockReturnValue({ isOwner: true } as any)
  })

  it('returns loading state while establishment is loading', () => {
    // Arrange
    vi.mocked(useEstablishment).mockReturnValue({
      establishment: null,
      loading: true,
      error: null,
    } as any)

    // Act
    const { result } = renderHook(() => useDashboard())

    // Assert
    expect(useRequireOwner).toHaveBeenCalled()
    expect(result.current.state).toBe('loading')
    expect(result.current.establishment).toBeNull()
  })

  it('returns error state when establishment cannot be loaded', () => {
    // Arrange
    vi.mocked(useEstablishment).mockReturnValue({
      establishment: null,
      loading: false,
      error: 'Estabelecimento não encontrado',
    } as any)

    // Act
    const { result } = renderHook(() => useDashboard())

    // Assert
    expect(result.current.state).toBe('error')
    expect(result.current.errorMessage).toBe('Estabelecimento não encontrado')
  })

  it('returns success state with establishment data', () => {
    // Arrange
    vi.mocked(useEstablishment).mockReturnValue({
      establishment: { code: 'est-1', name: 'Paleva' },
      loading: false,
      error: null,
    } as any)

    // Act
    const { result } = renderHook(() => useDashboard())

    // Assert
    expect(result.current.state).toBe('success')
    expect(result.current.establishment).toEqual({ code: 'est-1', name: 'Paleva' })
    expect(result.current.errorMessage).toBeNull()
  })
})
