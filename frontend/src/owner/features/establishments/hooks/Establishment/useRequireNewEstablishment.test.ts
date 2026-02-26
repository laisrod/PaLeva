import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useRequireNewEstablishment } from './useRequireNewEstablishment'
import { useAuth } from '../../../../../shared/hooks/useAuth'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../../shared/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

describe('useRequireNewEstablishment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects unauthenticated users to login', async () => {
    // Arrange
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      isOwner: false,
    } as any)

    // Act
    renderHook(() => useRequireNewEstablishment())

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/login')
    })
  })

  it('redirects owner with establishment to owner menus', async () => {
    // Arrange
    vi.mocked(useAuth).mockReturnValue({
      user: { establishment: { code: 'est-123' } },
      loading: false,
      isAuthenticated: true,
      isOwner: true,
    } as any)

    // Act
    renderHook(() => useRequireNewEstablishment())

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/establishment/est-123/menus')
    })
  })

  it('redirects authenticated non-owner with establishment to client menu', async () => {
    // Arrange
    vi.mocked(useAuth).mockReturnValue({
      user: { establishment: { code: 'est-client' } },
      loading: false,
      isAuthenticated: true,
      isOwner: false,
    } as any)

    // Act
    renderHook(() => useRequireNewEstablishment())

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/menu/est-client')
    })
  })
})
