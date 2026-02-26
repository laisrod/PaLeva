import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DrinksApi } from './drinks'

describe('DrinksApi', () => {
  let api: DrinksApi
  let requestSpy: ReturnType<typeof vi.spyOn>
  let requestFormDataSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    api = new DrinksApi()
    requestSpy = vi.spyOn(api as any, 'request').mockResolvedValue({ data: [] })
    requestFormDataSpy = vi.spyOn(api as any, 'requestFormData').mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('adds tag filter query params when tag ids are provided', async () => {
    // Arrange / Act
    await api.getDrinks('est-1', [1, 2])

    // Assert
    expect(requestSpy).toHaveBeenCalledWith('/establishments/est-1/drinks?tag_ids%5B%5D=1&tag_ids%5B%5D=2')
  })

  it('creates drink using form data with boolean, calories and tags', async () => {
    // Arrange
    const drinkData = {
      name: 'Suco',
      description: 'Natural',
      alcoholic: false,
      calories: 120,
      tag_ids: [3, 4],
    }

    // Act
    await api.createDrink('est-1', drinkData as any)

    // Assert
    const [, formData] = requestFormDataSpy.mock.calls[0]
    expect(requestFormDataSpy).toHaveBeenCalledWith(
      '/establishments/est-1/drinks',
      expect.any(FormData)
    )
    expect((formData as FormData).get('drink[name]')).toBe('Suco')
    expect((formData as FormData).get('drink[description]')).toBe('Natural')
    expect((formData as FormData).get('drink[alcoholic]')).toBe('0')
    expect((formData as FormData).get('drink[calories]')).toBe('120')
    expect((formData as FormData).getAll('drink[tag_ids][]')).toEqual(['3', '4'])
  })

  it('updates drink using PATCH form-data request', async () => {
    // Arrange
    const drinkData = {
      name: 'Refrigerante Zero',
      description: 'Atualizado',
    }

    // Act
    await api.updateDrink('est-1', 77, drinkData as any)

    // Assert
    expect(requestFormDataSpy).toHaveBeenCalledWith(
      '/establishments/est-1/drinks/77',
      expect.any(FormData),
      { method: 'PATCH' }
    )
  })
})
