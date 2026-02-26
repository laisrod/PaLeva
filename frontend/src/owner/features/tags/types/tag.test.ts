import { describe, it, expect } from 'vitest'
import { getCategoryFromSearchParams, getTagCategoryTitle } from './tag'

describe('tag types helpers', () => {
  it('defaults category to dish when query param is missing or invalid', () => {
    // Arrange / Act
    const missing = getCategoryFromSearchParams(new URLSearchParams(''))
    const invalid = getCategoryFromSearchParams(new URLSearchParams('category=other'))

    // Assert
    expect(missing).toBe('dish')
    expect(invalid).toBe('dish')
  })

  it('returns drink category and corresponding titles', () => {
    // Arrange / Act
    const category = getCategoryFromSearchParams(new URLSearchParams('category=drink'))

    // Assert
    expect(category).toBe('drink')
    expect(getTagCategoryTitle('dish')).toBe('Nova característica de Prato')
    expect(getTagCategoryTitle('drink')).toBe('Nova característica de Bebida')
  })
})
