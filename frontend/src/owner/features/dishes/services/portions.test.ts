import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { PortionsApi } from './portions'

describe('PortionsApi', () => {
  let api: PortionsApi
  let requestSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    api = new PortionsApi()
    requestSpy = vi.spyOn(api as any, 'request').mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('gets portions from dish portions endpoint', async () => {
    // Arrange / Act
    await api.getPortions('est-1', 10)

    // Assert
    expect(requestSpy).toHaveBeenCalledWith('/establishments/est-1/dishes/10/portions')
  })

  it('creates portion with JSON payload wrapper', async () => {
    // Arrange
    const portionData = { description: 'Grande', price: 20 }

    // Act
    await api.createPortion('est-1', 10, portionData as any)

    // Assert
    expect(requestSpy).toHaveBeenCalledWith(
      '/establishments/est-1/dishes/10/portions',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ portion: portionData }),
      })
    )
  })

  it('deletes portion by id', async () => {
    // Arrange / Act
    await api.deletePortion('est-1', 10, 77)

    // Assert
    expect(requestSpy).toHaveBeenCalledWith(
      '/establishments/est-1/dishes/10/portions/77',
      { method: 'DELETE' }
    )
  })
})
