import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MenusList from './MenusList'
import * as useMenusPageHook from '../../hooks/Menu/useMenusPage'

vi.mock('../../hooks/Menu/useMenusPage', () => ({
  useMenusPage: vi.fn(),
}))

vi.mock('../../hooks/Menu/useMenuCard', () => ({
  useMenuCard: () => ({
    showItemModal: false,
    setShowItemModal: vi.fn(),
    selectedMenuItemId: null,
    setSelectedMenuItemId: vi.fn(),
    selectedPortionId: null,
    setSelectedPortionId: vi.fn(),
    menuItems: [],
    loadingMenuItems: false,
    successMessage: null,
    addingItem: false,
    handleAddToOrder: vi.fn(),
    handleConfirmAddToOrder: vi.fn(),
  }),
}))

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('../../../orders/components/Orders/OrderSidebar', () => ({
  default: () => null,
}))

describe('MenusList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    vi.mocked(useMenusPageHook.useMenusPage).mockReturnValue({
      establishmentCode: 'test-code',
      isOwner: true,
      menus: [],
      loading: true,
      error: null,
      deleteMenu: vi.fn(),
    })

    render(
      <BrowserRouter>
        <MenusList />
      </BrowserRouter>
    )

    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('renders menus list when loaded', () => {
    const mockMenus = [
      { id: 1, name: 'Cardápio 1', description: 'Descrição 1', price: 10 },
      { id: 2, name: 'Cardápio 2', description: 'Descrição 2', price: 20 },
    ]

    vi.mocked(useMenusPageHook.useMenusPage).mockReturnValue({
      establishmentCode: 'test-code',
      isOwner: true,
      menus: mockMenus,
      loading: false,
      error: null,
      deleteMenu: vi.fn(),
    })

    render(
      <BrowserRouter>
        <MenusList />
      </BrowserRouter>
    )

    expect(screen.getByText('Cardápio 1')).toBeInTheDocument()
    expect(screen.getByText('Cardápio 2')).toBeInTheDocument()
  })

  it('renders empty state when no menus', () => {
    vi.mocked(useMenusPageHook.useMenusPage).mockReturnValue({
      establishmentCode: 'test-code',
      isOwner: true,
      menus: [],
      loading: false,
      error: null,
      deleteMenu: vi.fn(),
    })

    render(
      <BrowserRouter>
        <MenusList />
      </BrowserRouter>
    )

    expect(screen.getByText(/nenhum cardápio cadastrado/i)).toBeInTheDocument()
  })

  describe('Infinite Scroll', () => {
    it('renders sentinel when there are menus', () => {
      const mockMenus = [
        { id: 1, name: 'Cardápio 1', description: 'Descrição 1', price: 10 },
      ]

      vi.mocked(useMenusPageHook.useMenusPage).mockReturnValue({
        establishmentCode: 'test-code',
        isOwner: true,
        menus: mockMenus,
        loading: false,
        error: null,
        deleteMenu: vi.fn(),
      })

      render(
        <BrowserRouter>
          <MenusList />
        </BrowserRouter>
      )

      expect(screen.getByTestId('infinite-scroll-sentinel')).toBeInTheDocument()
    })

    it('displays only first page (12 items) when there are more than 12 menus', () => {
      const mockMenus = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Cardápio ${i + 1}`,
        description: `Descrição ${i + 1}`,
        price: (i + 1) * 10,
      }))

      vi.mocked(useMenusPageHook.useMenusPage).mockReturnValue({
        establishmentCode: 'test-code',
        isOwner: true,
        menus: mockMenus,
        loading: false,
        error: null,
        deleteMenu: vi.fn(),
      })

      render(
        <BrowserRouter>
          <MenusList />
        </BrowserRouter>
      )

      expect(screen.getByText('Cardápio 1')).toBeInTheDocument()
      expect(screen.getByText('Cardápio 12')).toBeInTheDocument()
      expect(screen.queryByText('Cardápio 13')).not.toBeInTheDocument()
      expect(screen.queryByText('Cardápio 15')).not.toBeInTheDocument()
    })

    it('does not render sentinel when no menus', () => {
      vi.mocked(useMenusPageHook.useMenusPage).mockReturnValue({
        establishmentCode: 'test-code',
        isOwner: true,
        menus: [],
        loading: false,
        error: null,
        deleteMenu: vi.fn(),
      })

      render(
        <BrowserRouter>
          <MenusList />
        </BrowserRouter>
      )

      expect(screen.queryByTestId('infinite-scroll-sentinel')).not.toBeInTheDocument()
    })
  })
})
