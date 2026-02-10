import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Drinks from './Drinks'
import * as useDrinksPageHook from '../../hooks/Drink/useDrinksPage'

vi.mock('../../hooks/Drink/useDrinksPage', () => ({
  useDrinksPage: vi.fn(),
}))

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('../../../orders/components/Orders/OrderSidebar', () => ({
  default: () => null,
}))

describe('Drinks Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    vi.mocked(useDrinksPageHook.useDrinksPage).mockReturnValue({
      establishmentCode: 'test-code',
      isOwner: true,
      drinks: [],
      tags: [],
      selectedTags: [],
      loading: true,
      error: null,
      toggleTag: vi.fn(),
      searchTerm: '',
      setSearchTerm: vi.fn(),
      deleteDrink: vi.fn(),
      deleting: false,
    })

    render(
      <BrowserRouter>
        <Drinks />
      </BrowserRouter>
    )

    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('renders drinks list when loaded', () => {
    const mockDrinks = [
      { id: 1, name: 'Bebida 1', description: 'Descrição 1' },
      { id: 2, name: 'Bebida 2', description: 'Descrição 2' },
    ]

    vi.mocked(useDrinksPageHook.useDrinksPage).mockReturnValue({
      establishmentCode: 'test-code',
      isOwner: true,
      drinks: mockDrinks,
      tags: [],
      selectedTags: [],
      loading: false,
      error: null,
      toggleTag: vi.fn(),
      searchTerm: '',
      setSearchTerm: vi.fn(),
      deleteDrink: vi.fn(),
      deleting: false,
    })

    render(
      <BrowserRouter>
        <Drinks />
      </BrowserRouter>
    )

    expect(screen.getByText('Bebida 1')).toBeInTheDocument()
    expect(screen.getByText('Bebida 2')).toBeInTheDocument()
  })

  it('renders empty state when no drinks', () => {
    vi.mocked(useDrinksPageHook.useDrinksPage).mockReturnValue({
      establishmentCode: 'test-code',
      isOwner: true,
      drinks: [],
      tags: [],
      selectedTags: [],
      loading: false,
      error: null,
      toggleTag: vi.fn(),
      searchTerm: '',
      setSearchTerm: vi.fn(),
      deleteDrink: vi.fn(),
      deleting: false,
    })

    render(
      <BrowserRouter>
        <Drinks />
      </BrowserRouter>
    )

    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument()
  })

  describe('Infinite Scroll', () => {
    it('renders sentinel when there are drinks', () => {
      const mockDrinks = [
        { id: 1, name: 'Bebida 1', description: 'Descrição 1' },
      ]

      vi.mocked(useDrinksPageHook.useDrinksPage).mockReturnValue({
        establishmentCode: 'test-code',
        isOwner: true,
        drinks: mockDrinks,
        tags: [],
        selectedTags: [],
        loading: false,
        error: null,
        toggleTag: vi.fn(),
        searchTerm: '',
        setSearchTerm: vi.fn(),
        deleteDrink: vi.fn(),
        deleting: false,
      })

      render(
        <BrowserRouter>
          <Drinks />
        </BrowserRouter>
      )

      expect(screen.getByTestId('infinite-scroll-sentinel')).toBeInTheDocument()
    })

    it('displays only first page (12 items) when there are more than 12 drinks', () => {
      const mockDrinks = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Bebida ${i + 1}`,
        description: `Descrição ${i + 1}`,
      }))

      vi.mocked(useDrinksPageHook.useDrinksPage).mockReturnValue({
        establishmentCode: 'test-code',
        isOwner: true,
        drinks: mockDrinks,
        tags: [],
        selectedTags: [],
        loading: false,
        error: null,
        toggleTag: vi.fn(),
        searchTerm: '',
        setSearchTerm: vi.fn(),
        deleteDrink: vi.fn(),
        deleting: false,
      })

      render(
        <BrowserRouter>
          <Drinks />
        </BrowserRouter>
      )

      expect(screen.getByText('Bebida 1')).toBeInTheDocument()
      expect(screen.getByText('Bebida 12')).toBeInTheDocument()
      expect(screen.queryByText('Bebida 13')).not.toBeInTheDocument()
      expect(screen.queryByText('Bebida 15')).not.toBeInTheDocument()
    })

    it('does not render sentinel when no drinks', () => {
      vi.mocked(useDrinksPageHook.useDrinksPage).mockReturnValue({
        establishmentCode: 'test-code',
        isOwner: true,
        drinks: [],
        tags: [],
        selectedTags: [],
        loading: false,
        error: null,
        toggleTag: vi.fn(),
        searchTerm: '',
        setSearchTerm: vi.fn(),
        deleteDrink: vi.fn(),
        deleting: false,
      })

      render(
        <BrowserRouter>
          <Drinks />
        </BrowserRouter>
      )

      expect(screen.queryByTestId('infinite-scroll-sentinel')).not.toBeInTheDocument()
    })
  })
})
