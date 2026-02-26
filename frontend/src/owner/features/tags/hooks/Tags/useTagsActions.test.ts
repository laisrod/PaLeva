import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTagsActions } from './useTagsActions'

describe('useTagsActions', () => {
  const deleteTag = vi.fn()
  const refetch = vi.fn()
  const confirmMock = vi.fn()
  const alertMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('confirm', confirmMock)
    vi.stubGlobal('alert', alertMock)
  })

  it('does not delete when user cancels confirmation', async () => {
    // Arrange
    confirmMock.mockReturnValue(false)
    const { result } = renderHook(() => useTagsActions({ deleteTag, refetch }))

    // Act
    let ok = true
    await act(async () => {
      ok = await result.current.handleDeleteTag(5)
    })

    // Assert
    expect(ok).toBe(false)
    expect(deleteTag).not.toHaveBeenCalled()
    expect(refetch).not.toHaveBeenCalled()
  })

  it('deletes and refetches when action succeeds', async () => {
    // Arrange
    confirmMock.mockReturnValue(true)
    deleteTag.mockResolvedValue(true)
    refetch.mockResolvedValue(undefined)
    const { result } = renderHook(() => useTagsActions({ deleteTag, refetch }))

    // Act
    let ok = false
    await act(async () => {
      ok = await result.current.handleDeleteTag(7)
    })

    // Assert
    expect(ok).toBe(true)
    expect(deleteTag).toHaveBeenCalledWith(7)
    expect(refetch).toHaveBeenCalled()
    expect(alertMock).not.toHaveBeenCalled()
  })
})
