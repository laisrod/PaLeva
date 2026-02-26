import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MenusListLoading from './MenusListLoading'

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('MenusListLoading', () => {
  it('renders loading feedback', () => {
    render(<MenusListLoading />)
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })
})
