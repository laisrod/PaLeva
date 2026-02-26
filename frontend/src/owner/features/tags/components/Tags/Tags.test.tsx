import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Tags from './Tags'
import { useTags } from '../../hooks/useTags'
import { useTagsActions } from '../../hooks/Tags/useTagsActions'
import { useAuth } from '../../../../../shared/hooks/useAuth'
import { useRequireOwner } from '../../../../../shared/hooks/useRequireOwner'

vi.mock('../../hooks/useTags', () => ({
  useTags: vi.fn(),
}))

vi.mock('../../hooks/Tags/useTagsActions', () => ({
  useTagsActions: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(() => ({ code: 'est-1' })),
    useSearchParams: vi.fn(() => [new URLSearchParams('')]),
  }
})

describe('Tags page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuth).mockReturnValue({ isOwner: true } as any)
  })

  it('renders loading state when current filter data is still loading', () => {
    // Arrange
    vi.mocked(useTags).mockImplementation((args: any) => {
      if (args.category === 'dish') {
        return { tags: [], loading: true, error: null, deleteTag: vi.fn(), refetch: vi.fn() } as any
      }
      return { tags: [], loading: false, error: null, deleteTag: vi.fn(), refetch: vi.fn() } as any
    })
    vi.mocked(useTagsActions).mockReturnValue({ handleDeleteTag: vi.fn() })

    // Act
    render(
      <MemoryRouter>
        <Tags />
      </MemoryRouter>
    )

    // Assert
    expect(useRequireOwner).toHaveBeenCalled()
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('renders dish and drink sections and deletes tag through action hook', () => {
    // Arrange
    const deleteDish = vi.fn()
    const deleteDrink = vi.fn()
    vi.mocked(useTags).mockImplementation((args: any) => {
      if (args.category === 'dish') {
        return {
          tags: [{ id: 1, name: 'Apimentado', category: 'dish' }],
          loading: false,
          error: null,
          deleteTag: vi.fn(),
          refetch: vi.fn(),
        } as any
      }
      return {
        tags: [{ id: 2, name: 'Gelada', category: 'drink' }],
        loading: false,
        error: null,
        deleteTag: vi.fn(),
        refetch: vi.fn(),
      } as any
    })
    vi.mocked(useTagsActions)
      .mockReturnValueOnce({ handleDeleteTag: deleteDish } as any)
      .mockReturnValueOnce({ handleDeleteTag: deleteDrink } as any)

    render(
      <MemoryRouter>
        <Tags />
      </MemoryRouter>
    )

    // Act
    fireEvent.click(screen.getAllByRole('button', { name: 'Remover' })[0])

    // Assert
    expect(screen.getByText('Características de Pratos')).toBeInTheDocument()
    expect(screen.getByText('Características de Bebidas')).toBeInTheDocument()
    expect(screen.getByText('Apimentado')).toBeInTheDocument()
    expect(screen.getByText('Gelada')).toBeInTheDocument()
    expect(deleteDish).toHaveBeenCalledWith(1)
  })
})
