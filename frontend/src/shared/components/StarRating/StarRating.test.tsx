import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StarRating from '../StarRating'

describe('StarRating', () => {
  it('renders the component with rating', () => {
    render(<StarRating rating={3.5} />)
    
    // Verifica se o componente renderiza
    const container = screen.getByRole('group', { hidden: true })
    expect(container).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<StarRating rating={4} size="small" />)
    expect(screen.getByRole('group', { hidden: true })).toBeInTheDocument()
    
    rerender(<StarRating rating={4} size="medium" />)
    expect(screen.getByRole('group', { hidden: true })).toBeInTheDocument()
    
    rerender(<StarRating rating={4} size="large" />)
    expect(screen.getByRole('group', { hidden: true })).toBeInTheDocument()
  })

  it('handles zero rating', () => {
    render(<StarRating rating={0} />)
    expect(screen.getByRole('group', { hidden: true })).toBeInTheDocument()
  })

  it('handles maximum rating', () => {
    render(<StarRating rating={5} />)
    expect(screen.getByRole('group', { hidden: true })).toBeInTheDocument()
  })

  it('shows value when showValue is true', () => {
    render(<StarRating rating={4.5} showValue />)
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })

  it('shows count when count is provided', () => {
    render(<StarRating rating={4} count={10} />)
    expect(screen.getByText('(10)')).toBeInTheDocument()
  })
})
