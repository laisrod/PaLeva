import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import OrderSidebar from './OrderSidebar'
import { useOrderSidebar } from '../../hooks/Orders/useOrderSidebar'

vi.mock('../../hooks/Orders/useOrderSidebar', () => ({
  useOrderSidebar: vi.fn(),
}))

describe('OrderSidebar component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    // Arrange
    vi.mocked(useOrderSidebar).mockReturnValue({
      loading: true,
      establishmentCode: 'est-1',
      currentOrder: null,
      totals: { subtotal: 0 },
      itemsCount: 0,
      handleGoToOrders: vi.fn(),
      handleRemoveItem: vi.fn(),
      removingId: null,
      activeOrders: [],
      activeOrdersTotal: 0,
    } as any)

    // Act
    render(
      <MemoryRouter>
        <OrderSidebar establishmentCode="est-1" />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('renders active orders list when there is no current order', () => {
    // Arrange
    vi.mocked(useOrderSidebar).mockReturnValue({
      loading: false,
      establishmentCode: 'est-1',
      currentOrder: null,
      totals: { subtotal: 0 },
      itemsCount: 0,
      handleGoToOrders: vi.fn(),
      handleRemoveItem: vi.fn(),
      removingId: null,
      activeOrders: [{ id: 1, code: 'ORD-1', status: 'draft', total_price: 25 }],
      activeOrdersTotal: 25,
    } as any)

    // Act
    render(
      <MemoryRouter>
        <OrderSidebar establishmentCode="est-1" />
      </MemoryRouter>
    )

    // Assert
    expect(screen.getByText(/pedidos ativos/i)).toBeInTheDocument()
    expect(screen.getByText('#ORD-1')).toBeInTheDocument()
    expect(screen.getByText('Total Geral')).toBeInTheDocument()
    expect(screen.getAllByText('R$ 25.00').length).toBeGreaterThanOrEqual(1)
  })

  it('renders current order items and triggers remove action', () => {
    // Arrange
    const handleRemoveItem = vi.fn()
    vi.mocked(useOrderSidebar).mockReturnValue({
      loading: false,
      establishmentCode: 'est-1',
      currentOrder: {
        code: 'ORD-10',
        order_menu_items: [
          {
            id: 99,
            quantity: 2,
            menu_id: 10,
            menu: { name: 'Combo', price: 15 },
          },
        ],
      },
      totals: { subtotal: 30 },
      itemsCount: 1,
      handleGoToOrders: vi.fn(),
      handleRemoveItem,
      removingId: null,
      activeOrders: [],
      activeOrdersTotal: 0,
    } as any)

    // Act
    render(
      <MemoryRouter>
        <OrderSidebar establishmentCode="est-1" />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByLabelText('Remover Combo'))

    // Assert
    expect(screen.getByText('Orders #ORD-10')).toBeInTheDocument()
    expect(handleRemoveItem).toHaveBeenCalledWith(99)
  })
})
