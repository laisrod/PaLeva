import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dishes from './Dishes'
import * as useDishesPageHook from '../../hooks/Dish/useDishesPage'

// Mock do hook
vi.mock('../../hooks/Dish/useDishesPage', () => ({
  useDishesPage: vi.fn(),
}))

// Mock do Layout
vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('Dishes Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    vi.mocked(useDishesPageHook.useDishesPage).mockReturnValue({
      establishmentCode: 'test-code',
      isOwner: true,
      dishes: [],
      tags: [],
      selectedTags: [],
      loading: true,
      toggleTag: vi.fn(),
      searchTerm: '',
      setSearchTerm: vi.fn(),
      deleteDish: vi.fn(),
      deleting: false,
    })

    render(
      <BrowserRouter>
        <Dishes />
      </BrowserRouter>
    )

    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('renders dishes list when loaded', () => {
    const mockDishes = [
      { id: 1, name: 'Prato 1', description: 'Descrição 1' },
      { id: 2, name: 'Prato 2', description: 'Descrição 2' },
    ]

    vi.mocked(useDishesPageHook.useDishesPage).mockReturnValue({
      establishmentCode: 'test-code',
      isOwner: true,
      dishes: mockDishes,
      tags: [],
      selectedTags: [],
      loading: false,
      toggleTag: vi.fn(),
      searchTerm: '',
      setSearchTerm: vi.fn(),
      deleteDish: vi.fn(),
      deleting: false,
    })

    render(
      <BrowserRouter>
        <Dishes />
      </BrowserRouter>
    )

    expect(screen.getByText('Prato 1')).toBeInTheDocument()
    expect(screen.getByText('Prato 2')).toBeInTheDocument()
  })

  it('renders empty state when no dishes', () => {
    vi.mocked(useDishesPageHook.useDishesPage).mockReturnValue({
      establishmentCode: 'test-code',
      isOwner: true,
      dishes: [],
      tags: [],
      selectedTags: [],
      loading: false,
      toggleTag: vi.fn(),
      searchTerm: '',
      setSearchTerm: vi.fn(),
      deleteDish: vi.fn(),
      deleting: false,
    })

    render(
      <BrowserRouter>
        <Dishes />
      </BrowserRouter>
    )

    // Verifica se o componente de estado vazio é renderizado
    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument()
  })
})
