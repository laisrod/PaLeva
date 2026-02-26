import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import TestCreateOrder from './TestCreateOrder'
import { useTestCreateOrderPage } from '../../hooks/Orders/useTestCreateOrderPage'

vi.mock('../../hooks/Orders/useTestCreateOrderPage', () => ({
  useTestCreateOrderPage: vi.fn(),
}))

vi.mock('../../../menus/components/Menu/MenuItemsList', () => ({
  default: ({ onSelectItem }: { onSelectItem: (menuItemId: number, portionId: number, quantity: number) => void }) => (
    <button onClick={() => onSelectItem(1, 2, 1)}>Selecionar Item</button>
  ),
}))

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('TestCreateOrder component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders create button and calls create handler', () => {
    // Arrange
    const handleCreateOrder = vi.fn()
    vi.mocked(useTestCreateOrderPage).mockReturnValue({
      currentOrder: null,
      loading: false,
      error: null,
      totals: { subtotal: 0, serviceFee: 0, tax: 0, total: 0 },
      itemsCount: 0,
      menus: [],
      loadingMenus: false,
      selectedMenuId: undefined,
      setSelectedMenuId: vi.fn(),
      menuItems: [],
      loadingMenuItems: false,
      addItemError: null,
      addingItem: false,
      handleCreateOrder,
      handleSelectItem: vi.fn(),
      clearOrder: vi.fn(),
    } as any)

    // Act
    render(
      <BrowserRouter>
        <TestCreateOrder />
      </BrowserRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Criar Pedido Draft' }))

    // Assert
    expect(handleCreateOrder).toHaveBeenCalled()
  })

  it('renders current order details and clears order on click', () => {
    // Arrange
    const clearOrder = vi.fn()
    vi.mocked(useTestCreateOrderPage).mockReturnValue({
      currentOrder: {
        id: 10,
        code: 'ORD-10',
        status: 'draft',
        order_menu_items: [
          {
            id: 1,
            menu_item_id: 1,
            portion_id: 2,
            quantity: 1,
            menu_item: { name: 'Prato' },
            portion: { description: 'Grande', price: 12 },
          },
        ],
      },
      loading: false,
      error: null,
      totals: { subtotal: 12, serviceFee: 0.6, tax: 1.2, total: 13.8 },
      itemsCount: 1,
      menus: [{ id: 1, name: 'Menu do dia' }],
      loadingMenus: false,
      selectedMenuId: 1,
      setSelectedMenuId: vi.fn(),
      menuItems: [{ id: 1, name: 'Prato' }],
      loadingMenuItems: false,
      addItemError: null,
      addingItem: false,
      handleCreateOrder: vi.fn(),
      handleSelectItem: vi.fn(),
      clearOrder,
    } as any)

    // Act
    render(
      <BrowserRouter>
        <TestCreateOrder />
      </BrowserRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Limpar Pedido' }))

    // Assert
    expect(screen.getByText('ORD-10')).toBeInTheDocument()
    expect(screen.getByText('R$ 13.80')).toBeInTheDocument()
    expect(clearOrder).toHaveBeenCalled()
  })
})
