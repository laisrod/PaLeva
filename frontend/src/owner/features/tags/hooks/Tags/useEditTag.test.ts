import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useEditTag } from './useEditTag'
import { ownerApi } from '../../../../shared/services/api'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    getTag: vi.fn(),
    updateTag: vi.fn(),
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useEditTag', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads current tag and prefills name', async () => {
    // Arrange
    vi.mocked(ownerApi.getTag).mockResolvedValue({
      data: { id: 2, name: 'Artesanal', category: 'drink' },
    } as any)

    // Act
    const { result } = renderHook(() => useEditTag('est-1', '2'))

    // Assert
    await waitFor(() => {
      expect(result.current.name).toBe('Artesanal')
      expect(result.current.loadingTag).toBe(false)
    })
    expect(ownerApi.getTag).toHaveBeenCalledWith('est-1', 2)
  })

  it('submits trimmed name and redirects on successful update', async () => {
    // Arrange
    vi.mocked(ownerApi.getTag).mockResolvedValue({ data: { id: 2, name: 'Gelada' } } as any)
    vi.mocked(ownerApi.updateTag).mockResolvedValue({ data: { tag: { id: 2 } } } as any)
    const { result } = renderHook(() => useEditTag('est-1', '2'))
    await waitFor(() => {
      expect(result.current.loadingTag).toBe(false)
    })
    act(() => {
      result.current.handleChange({ target: { value: '  Premium  ' } } as any)
    })

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(ownerApi.updateTag).toHaveBeenCalledWith('est-1', 2, 'Premium')
    expect(navigateMock).toHaveBeenCalledWith('/establishment/est-1/tags')
  })
})
