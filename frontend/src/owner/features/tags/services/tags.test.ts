import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TagsApi } from './tags'

describe('TagsApi', () => {
  let api: TagsApi
  let requestSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    api = new TagsApi()
    requestSpy = vi.spyOn(api as any, 'request').mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('gets tags with category query when provided', async () => {
    // Arrange / Act
    await api.getTags('est-1', 'drink')

    // Assert
    expect(requestSpy).toHaveBeenCalledWith('/establishments/est-1/tags?category=drink')
  })

  it('creates tag with wrapped payload', async () => {
    // Arrange / Act
    await api.createTag('est-1', 'Gelada', 'drink')

    // Assert
    expect(requestSpy).toHaveBeenCalledWith(
      '/establishments/est-1/tags',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ tag: { name: 'Gelada', category: 'drink' } }),
      })
    )
  })

  it('deletes tag using delete endpoint', async () => {
    // Arrange / Act
    await api.deleteTag('est-1', 9)

    // Assert
    expect(requestSpy).toHaveBeenCalledWith(
      '/establishments/est-1/tags/9',
      expect.objectContaining({ method: 'DELETE' })
    )
  })
})
