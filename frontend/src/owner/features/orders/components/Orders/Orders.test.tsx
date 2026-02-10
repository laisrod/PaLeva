import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Orders from './Orders'
import * as useOrdersPageHook from '../../hooks/Orders/useOrdersPage'

vi.mock('../../hooks/Orders/useOrdersPage', () => ({
  useOrdersPage: vi.fn(),
}))

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('../../../menus/components/Menu/MenuItemsList', () => ({
  default: () => null,
}))

const createMockOrder = (id: number, code: string) => ({
  id,
  code,
  status: 'pending' as const,
  total_price: 50,
  created_at: '2024-01-01T12:00:00Z',
  updated_at: '2024-01-01T12:00:00Z',
  establishment_id: 1,
})

const getBaseMockReturn = () => ({
  establishmentCode: 'test-code',
  currentOrder: null,
  loadingCurrentOrder: false,
  currentOrderError: null,
  totals: { subtotal: 0, serviceFee: 0, tax: 0, total: 0 },
  itemsCount: 0,
  orderFormRef: { current: null },
  orders: [] as ReturnType<typeof createMockOrder>[],
  loadingOrders: false,
  ordersError: null,
  changeStatus: vi.fn(),
  deleteOrder: vi.fn(),
  showCreateOrder: false,
  selectedMenuId: null,
  selectedDishId: null,
  selectedDrinkId: null,
  handleSelectMenu: vi.fn(),
  handleToggleDish: vi.fn(),
  handleToggleDrink: vi.fn(),
  handleSelectDishPortion: vi.fn(),
  handleSelectDrinkPortion: vi.fn(),
  handleSelectMenuItem: vi.fn(),
  menus: [],
  loadingMenus: false,
  menuItems: [],
  loadingMenuItems: false,
  dishes: [],
  loadingDishes: false,
  dishesError: null,
  drinks: [],
  loadingDrinks: false,
  drinksError: null,
  dishPortions: [],
  loadingDishPortions: false,
  drinkPortions: [],
  loadingDrinkPortions: false,
  addItem: vi.fn(),
  addingItem: false,
  addItemError: null,
  customerInfo: { customer_name: '', customer_email: '', customer_phone: '', customer_cpf: '' },
  setCustomerInfo: vi.fn(),
  updatingOrder: false,
  showCustomerModal: false,
  setShowCustomerModal: vi.fn(),
  handleCreateOrder: vi.fn(),
  handleClearOrderAndForm: vi.fn(),
  handleSaveOrder: vi.fn(),
  handleConfirmSaveOrder: vi.fn(),
})

describe('Orders Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('confirm', vi.fn(() => false))
    vi.stubGlobal('prompt', vi.fn(() => null))
  })

  it('renders loading state', () => {
    vi.mocked(useOrdersPageHook.useOrdersPage).mockReturnValue({
      ...getBaseMockReturn(),
      loadingOrders: true,
      orders: [],
    })

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    )

    expect(screen.getByText(/carregando pedidos/i)).toBeInTheDocument()
  })

  it('renders orders list when loaded', () => {
    const mockOrders = [
      createMockOrder(1, 'ORD-001'),
      createMockOrder(2, 'ORD-002'),
    ]

    vi.mocked(useOrdersPageHook.useOrdersPage).mockReturnValue({
      ...getBaseMockReturn(),
      orders: mockOrders,
    })

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    )

    expect(screen.getByText(/#ORD-001/i)).toBeInTheDocument()
    expect(screen.getByText(/#ORD-002/i)).toBeInTheDocument()
  })

  it('renders empty state when no orders', () => {
    vi.mocked(useOrdersPageHook.useOrdersPage).mockReturnValue({
      ...getBaseMockReturn(),
      orders: [],
    })

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    )

    expect(screen.getByText(/nenhum pedido encontrado/i)).toBeInTheDocument()
  })

  describe('Infinite Scroll', () => {
    it('renders sentinel when there are orders', () => {
      const mockOrders = [createMockOrder(1, 'ORD-001')]

      vi.mocked(useOrdersPageHook.useOrdersPage).mockReturnValue({
        ...getBaseMockReturn(),
        orders: mockOrders,
      })

      render(
        <BrowserRouter>
          <Orders />
        </BrowserRouter>
      )

      expect(screen.getByTestId('infinite-scroll-sentinel')).toBeInTheDocument()
    })

    it('displays only first page (12 items) when there are more than 12 orders', () => {
      const mockOrders = Array.from({ length: 15 }, (_, i) =>
        createMockOrder(i + 1, `ORD-${String(i + 1).padStart(3, '0')}`)
      )

      vi.mocked(useOrdersPageHook.useOrdersPage).mockReturnValue({
        ...getBaseMockReturn(),
        orders: mockOrders,
      })

      render(
        <BrowserRouter>
          <Orders />
        </BrowserRouter>
      )

      expect(screen.getByText(/#ORD-001/i)).toBeInTheDocument()
      expect(screen.getByText(/#ORD-012/i)).toBeInTheDocument()
      expect(screen.queryByText(/#ORD-013/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/#ORD-015/i)).not.toBeInTheDocument()
    })

    it('does not render sentinel when no orders', () => {
      vi.mocked(useOrdersPageHook.useOrdersPage).mockReturnValue({
        ...getBaseMockReturn(),
        orders: [],
      })

      render(
        <BrowserRouter>
          <Orders />
        </BrowserRouter>
      )

      expect(screen.queryByTestId('infinite-scroll-sentinel')).not.toBeInTheDocument()
    })
  })
})
