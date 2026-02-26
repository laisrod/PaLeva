import { describe, it, expect } from 'vitest'
import { getStatusBadge } from './orderStatus'

describe('getStatusBadge', () => {
  it('returns a translated label and color for known statuses', () => {
    // Arrange
    const status = 'ready'

    // Act
    const badge = getStatusBadge(status)

    // Assert
    expect(badge).toEqual({
      label: 'Pronto!',
      color: '#10b981',
    })
  })

  it('returns fallback badge when status is unknown', () => {
    // Arrange
    const status = 'custom_status'

    // Act
    const badge = getStatusBadge(status)

    // Assert
    expect(badge).toEqual({
      label: 'custom_status',
      color: '#6b7280',
    })
  })
})
