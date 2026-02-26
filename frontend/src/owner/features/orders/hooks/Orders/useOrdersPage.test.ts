import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useOrdersPage } from './useOrdersPage'
import { useCurrentOrder } from './useCurrentOrder'
import { useOrderForm } from './useOrderForm'
import { useOrders } from './useOrders'
import { useOrderUpdates } from './useOrderUpdates'
import { ownerApi } from '../../../../shared/services/api'

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useRequireOwner', () => ({
  useRequireOwner: vi.fn(),
}))

vi.mock('../../../../../shared/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('./useCurrentOrder', () => ({
  useCurrentOrder: vi.fn(),
}))

vi.mock('./useOrderForm', () => ({
  useOrderForm: vi.fn(),
}))

vi.mock('./useOrders', () => ({
  useOrders: vi.fn(),
}))

vi.mock('./useOrderUpdates', () => ({
  useOrderUpdates: vi.fn(),
}))

vi.mock('../../../menus/hooks/Menu/useMenus', () => ({
  useMenus: vi.fn(() => ({ menus: [], loading: false })),
}))

vi.mock('../../../menus/hooks/Menu/useMenuItems', () => ({
  useMenuItems: vi.fn(() => ({ menuItems: [], loading: false })),
}))

vi.mock('../../../dishes/hooks/Dish/useDishes', () => ({
  useDishes: vi.fn(() => ({ dishes: [], loading: false, error: null })),
}))

vi.mock('../../../drinks/hooks/Drink/useDrinks', () => ({
  useDrinks: vi.fn(() => ({ drinks: [], loading: false, error: null })),
}))

vi.mock('../../../dishes/hooks/DishPortion/useDishPortions', () => ({
  useDishPortions: vi.fn(() => ({ portions: [], loading: false })),
}))

vi.mock('../../../drinks/hooks/DrinkPortion/useDrinkPortions', () => ({
  useDrinkPortions: vi.fn(() => ({ portions: [], loading: false })),
}))

vi.mock('./useAddOrderItem', () => ({
  useAddOrderItem: vi.fn(() => ({ addItem: vi.fn(), loading: false, error: null })),
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    updateOrder: vi.fn(),
  },
}))

describe('useOrdersPage', () => {
  const createNewOrderMock = vi.fn()
  const clearOrderMock = vi.fn()
  const loadOrderMock = vi.fn()
  const refetchOrdersMock = vi.fn()
  const changeStatusMock = vi.fn()
  const handleCreateOrderMock = vi.fn()
  const handleClearOrderMock = vi.fn()

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.stubGlobal('alert', vi.fn())
    const { useParams } = await import('react-router-dom')
    const { useAuth } = await import('../../../../../shared/hooks/useAuth')
    vi.mocked(useParams).mockReturnValue({ code: 'est-1' } as any)
    vi.mocked(useAuth).mockReturnValue({ user: null } as any)

    vi.mocked(useCurrentOrder).mockReturnValue({
      currentOrder: {
        code: 'ORD-1',
        status: 'draft',
        order_menu_items: [],
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_cpf: '',
      },
      loading: false,
      error: null,
      createNewOrder: createNewOrderMock,
      clearOrder: clearOrderMock,
      loadOrder: loadOrderMock,
      totals: { subtotal: 0, tax: 0, serviceFee: 0, total: 0 },
      itemsCount: 0,
    } as any)

    vi.mocked(useOrderForm).mockReturnValue({
      showCreateOrder: false,
      selectedMenuId: undefined,
      selectedDishId: undefined,
      selectedDrinkId: undefined,
      handleCreateOrder: handleCreateOrderMock,
      handleClearOrder: handleClearOrderMock,
      handleSelectMenu: vi.fn(),
      handleToggleDish: vi.fn(),
      handleToggleDrink: vi.fn(),
      handleSelectDishPortion: vi.fn(),
      handleSelectDrinkPortion: vi.fn(),
      handleSelectMenuItem: vi.fn(),
    } as any)

    vi.mocked(useOrders).mockReturnValue({
      orders: [],
      loading: false,
      error: null,
      changeStatus: changeStatusMock,
      deleteOrder: vi.fn(),
      refetch: refetchOrdersMock,
    } as any)
  })

  it('wires create/clear handlers and configures realtime updates', () => {
    // Arrange / Act
    const { result } = renderHook(() => useOrdersPage())
    act(() => {
      result.current.handleCreateOrder()
      result.current.handleClearOrderAndForm()
    })

    // Assert
    expect(handleCreateOrderMock).toHaveBeenCalledWith(createNewOrderMock)
    expect(handleClearOrderMock).toHaveBeenCalled()
    expect(clearOrderMock).toHaveBeenCalled()
    expect(useOrderUpdates).toHaveBeenCalledWith(
      expect.objectContaining({
        establishmentCode: 'est-1',
        enabled: true,
      })
    )
  })

  it('alerts when trying to save order without items', () => {
    // Arrange
    const { result } = renderHook(() => useOrdersPage())

    // Act
    act(() => {
      result.current.handleSaveOrder()
    })

    // Assert
    expect(alert).toHaveBeenCalledWith('Adicione pelo menos um item ao pedido antes de salvar')
  })

  it('updates order, confirms draft status and resets form on confirm save', async () => {
    // Arrange
    vi.mocked(useCurrentOrder).mockReturnValue({
      currentOrder: {
        code: 'ORD-2',
        status: 'draft',
        order_menu_items: [{ id: 1, quantity: 1, portion: { price: 10 } }],
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_cpf: '',
      },
      loading: false,
      error: null,
      createNewOrder: createNewOrderMock,
      clearOrder: clearOrderMock,
      loadOrder: loadOrderMock,
      totals: { subtotal: 10, tax: 1, serviceFee: 0.5, total: 11.5 },
      itemsCount: 1,
    } as any)
    vi.mocked(ownerApi.updateOrder).mockResolvedValue({ data: { ok: true } } as any)
    changeStatusMock.mockResolvedValue(undefined)
    const { result } = renderHook(() => useOrdersPage())

    // Act
    act(() => {
      result.current.setCustomerInfo((prev) => ({ ...prev, customer_email: 'cliente@mail.com' }))
    })
    await act(async () => {
      await result.current.handleConfirmSaveOrder()
    })

    // Assert
    await waitFor(() => {
      expect(ownerApi.updateOrder).toHaveBeenCalledWith(
        'est-1',
        'ORD-2',
        expect.objectContaining({ customer_email: 'cliente@mail.com' })
      )
    })
    expect(changeStatusMock).toHaveBeenCalledWith('ORD-2', 'confirm')
    expect(refetchOrdersMock).toHaveBeenCalled()
    expect(clearOrderMock).toHaveBeenCalled()
    expect(handleClearOrderMock).toHaveBeenCalled()
  })
})
