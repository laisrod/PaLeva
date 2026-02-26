import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import EditMenuLoading from './EditMenuLoading'

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('EditMenuLoading', () => {
  it('renders loading feedback', () => {
    render(<EditMenuLoading />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })
})
