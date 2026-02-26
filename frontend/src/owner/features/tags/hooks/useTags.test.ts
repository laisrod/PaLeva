import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useTags } from './useTags'
import { ownerApi } from '../../../shared/services/api'

vi.mock('../../../shared/services/api', () => ({
  ownerApi: {
    getTags: vi.fn(),
    deleteTag: vi.fn(),
  },
}))

describe('useTags', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads tags from api and supports object signature with category', async () => {
    // Arrange
    vi.mocked(ownerApi.getTags).mockResolvedValue({
      data: [{ id: 1, name: 'Gelada', category: 'drink' }],
    } as any)

    // Act
    const { result } = renderHook(() =>
      useTags({ establishmentCode: 'est-1', category: 'drink' })
    )

    // Assert
    await waitFor(() => {
      expect(result.current.tags).toEqual([{ id: 1, name: 'Gelada', category: 'drink' }])
    })
    expect(ownerApi.getTags).toHaveBeenCalledWith('est-1', 'drink')
  })

  it('deletes tag and removes item from local state', async () => {
    // Arrange
    vi.mocked(ownerApi.getTags).mockResolvedValue({
      data: [
        { id: 1, name: 'Gelada', category: 'drink' },
        { id: 2, name: 'Doce', category: 'drink' },
      ],
    } as any)
    vi.mocked(ownerApi.deleteTag).mockResolvedValue({ data: { message: 'ok' } } as any)
    const { result } = renderHook(() => useTags('est-1', 'drink'))
    await waitFor(() => expect(result.current.tags.length).toBe(2))

    // Act
    let success = false
    await act(async () => {
      success = await result.current.deleteTag(1)
    })

    // Assert
    expect(success).toBe(true)
    expect(ownerApi.deleteTag).toHaveBeenCalledWith('est-1', 1)
    expect(result.current.tags).toEqual([{ id: 2, name: 'Doce', category: 'drink' }])
  })
})
