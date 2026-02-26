import { describe, it, expect } from 'vitest'
import { OrderAction } from './order'

describe('order types', () => {
  it('keeps the supported order actions used by status transitions', () => {
    // Arrange
    const actions: OrderAction[] = ['confirm', 'prepare', 'ready', 'deliver', 'cancel']

    // Act / Assert
    expect(actions).toEqual(['confirm', 'prepare', 'ready', 'deliver', 'cancel'])
  })
})
