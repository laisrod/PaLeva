import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DishesApi } from './dishes'

describe('DishesApi', () => {
  let api: DishesApi
  let requestSpy: ReturnType<typeof vi.spyOn>
  let requestFormDataSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    api = new DishesApi()
    requestSpy = vi.spyOn(api as any, 'request').mockResolvedValue({ data: [] })
    requestFormDataSpy = vi.spyOn(api as any, 'requestFormData').mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('adds tag filter query params when tag ids are provided', async () => {
    // Arrange / Act
    await api.getDishes('est-1', [1, 2])

    // Assert
    expect(requestSpy).toHaveBeenCalledWith('/establishments/est-1/dishes?tag_ids%5B%5D=1&tag_ids%5B%5D=2')
  })

  it('creates dish using form data with base fields and tags', async () => {
    // Arrange
    const dishData = {
      name: 'Feijoada',
      description: 'Tradicional',
      calories: 650,
      tag_ids: [10, 11],
    }

    // Act
    await api.createDish('est-1', dishData as any)

    // Assert
    const [, formData] = requestFormDataSpy.mock.calls[0]
    expect(requestFormDataSpy).toHaveBeenCalledWith(
      '/establishments/est-1/dishes',
      expect.any(FormData)
    )
    expect((formData as FormData).get('dish[name]')).toBe('Feijoada')
    expect((formData as FormData).get('dish[description]')).toBe('Tradicional')
    expect((formData as FormData).get('dish[calories]')).toBe('650')
    expect((formData as FormData).getAll('dish[tag_ids][]')).toEqual(['10', '11'])
  })

  it('updates dish using PATCH form-data request', async () => {
    // Arrange
    const dishData = {
      name: 'Feijoada Premium',
      description: 'Atualizada',
    }

    // Act
    await api.updateDish('est-1', 55, dishData as any)

    // Assert
    expect(requestFormDataSpy).toHaveBeenCalledWith(
      '/establishments/est-1/dishes/55',
      expect.any(FormData),
      { method: 'PATCH' }
    )
  })
})
