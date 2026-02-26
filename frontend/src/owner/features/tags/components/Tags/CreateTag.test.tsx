import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CreateTag from './CreateTag'
import { useCreateTag } from '../../hooks/Tags/useCreateTag'

vi.mock('../../hooks/Tags/useCreateTag', () => ({
  useCreateTag: vi.fn(),
}))

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(() => ({ code: 'est-1' })),
  }
})

describe('CreateTag page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title, field and displays errors from hook state', () => {
    // Arrange
    vi.mocked(useCreateTag).mockReturnValue({
      establishmentCode: 'est-1',
      title: 'Nova característica de Bebida',
      category: 'drink',
      name: '',
      loading: false,
      errors: ['Nome é obrigatório'],
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
    })

    // Act
    render(
      <MemoryRouter>
        <CreateTag />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByRole('heading', { name: 'Nova característica de Bebida' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nome *')).toBeInTheDocument()
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
  })

  it('submits form through hook handler', () => {
    // Arrange
    const handleSubmit = vi.fn((e: any) => e.preventDefault())
    vi.mocked(useCreateTag).mockReturnValue({
      establishmentCode: 'est-1',
      title: 'Nova característica de Prato',
      category: 'dish',
      name: 'Apimentado',
      loading: false,
      errors: [],
      handleChange: vi.fn(),
      handleSubmit,
    })
    render(
      <MemoryRouter>
        <CreateTag />
      </MemoryRouter>
    )

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    // Assert
    expect(handleSubmit).toHaveBeenCalled()
  })
})
