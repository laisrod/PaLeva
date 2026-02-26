import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EditTag from './EditTag'
import { useEditTag } from '../../hooks/Tags/useEditTag'

vi.mock('../../hooks/Tags/useEditTag', () => ({
  useEditTag: vi.fn(),
}))

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(() => ({ code: 'est-1', id: '2' })),
  }
})

describe('EditTag page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading feedback while tag data is loading', () => {
    // Arrange
    vi.mocked(useEditTag).mockReturnValue({
      establishmentCode: 'est-1',
      tagId: 2,
      name: '',
      loading: false,
      loadingTag: true,
      errors: [],
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
    })

    // Act
    render(
      <MemoryRouter>
        <EditTag />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('renders form with existing tag and submits changes', () => {
    // Arrange
    const handleSubmit = vi.fn((e: any) => e.preventDefault())
    vi.mocked(useEditTag).mockReturnValue({
      establishmentCode: 'est-1',
      tagId: 2,
      name: 'Artesanal',
      loading: false,
      loadingTag: false,
      errors: [],
      handleChange: vi.fn(),
      handleSubmit,
    })
    render(
      <MemoryRouter>
        <EditTag />
      </MemoryRouter>
    )

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    // Assert
    expect(screen.getByDisplayValue('Artesanal')).toBeInTheDocument()
    expect(handleSubmit).toHaveBeenCalled()
  })
})
