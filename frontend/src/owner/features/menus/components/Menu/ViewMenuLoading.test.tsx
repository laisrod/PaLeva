import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ViewMenuLoading from './ViewMenuLoading'

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('ViewMenuLoading', () => {
  it('renders loading feedback', () => {
    render(<ViewMenuLoading />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })
})
