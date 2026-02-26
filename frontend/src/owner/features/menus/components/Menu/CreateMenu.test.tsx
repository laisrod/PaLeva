import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CreateMenu from './CreateMenu'
import { useCreateMenuPage } from '../../hooks/Menu/useCreateMenuPage'

vi.mock('../../hooks/Menu/useCreateMenuPage', () => ({
  useCreateMenuPage: vi.fn(),
}))

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('CreateMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form fields and submits through hook handler', () => {
    // Arrange
    const handleSubmit = vi.fn((e: any) => e.preventDefault())
    vi.mocked(useCreateMenuPage).mockReturnValue({
      establishmentCode: 'est-1',
      formData: { name: 'Almoco', description: 'Do dia' },
      errors: [],
      loading: false,
      handleChange: vi.fn(),
      handleSubmit,
    } as any)

    // Act
    render(
      <MemoryRouter>
        <CreateMenu />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Cardápio' }))

    // Assert
    expect(screen.getByDisplayValue('Almoco')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Do dia')).toBeInTheDocument()
    expect(handleSubmit).toHaveBeenCalled()
  })
})
