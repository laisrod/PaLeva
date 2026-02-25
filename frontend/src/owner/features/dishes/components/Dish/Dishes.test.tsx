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

    expect(screen.getByText(/nenhum prato cadastrado/i)).toBeInTheDocument()
  })

  describe('Infinite Scroll', () => {
    it('renders sentinel when there are dishes', () => {
      const mockDishes = [
        { id: 1, name: 'Prato 1', description: 'Descrição 1' },
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

      expect(screen.getByTestId('infinite-scroll-sentinel')).toBeInTheDocument()
    })

    it('displays only first page (12 items) when there are more than 12 dishes', () => {
      const mockDishes = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Prato ${i + 1}`,
        description: `Descrição ${i + 1}`,
      }))

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
      expect(screen.getByText('Prato 12')).toBeInTheDocument()
      expect(screen.queryByText('Prato 13')).not.toBeInTheDocument()
      expect(screen.queryByText('Prato 15')).not.toBeInTheDocument()
    })

    it('does not render sentinel when no dishes', () => {
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

      expect(screen.queryByTestId('infinite-scroll-sentinel')).not.toBeInTheDocument()
    })
  })
})
