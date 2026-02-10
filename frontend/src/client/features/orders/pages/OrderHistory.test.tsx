import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import OrderHistory from './OrderHistory'
import * as useOrderHistoryPageHook from '../hooks/useOrderHistoryPage'

vi.mock('../hooks/useOrderHistoryPage', () => ({
  useOrderHistoryPage: vi.fn(),
}))

vi.mock('../../../shared/layouts/ClientLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock do Layout do owner (import dinâmico)
vi.mock('../../../../owner/shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const createMockOrder = (id: number, code: string) => ({
  id,
  code,
  status: 'delivered' as const,
  total_price: 50,
  created_at: '2024-01-01T12:00:00Z',
  establishment: { name: 'Estabelecimento 1', code: 'est1' },
  customer: { name: 'Cliente', email: 'cliente@test.com' },
})

describe('OrderHistory Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state', () => {
    vi.mocked(useOrderHistoryPageHook.useOrderHistoryPage).mockReturnValue({
      orders: [],
      pagination: { page: 1, total_pages: 1 },
      loading: true,
      error: null,
      isOwner: false,
      startDate: '',
      setStartDate: vi.fn(),
      endDate: '',
      setEndDate: vi.fn(),
      status: '',
      setStatus: vi.fn(),
      handleFilterChange: vi.fn(),
      handlePageChange: vi.fn(),
      refetch: vi.fn(),
      loadMore: vi.fn(),
      hasMore: false,
    })

    render(<OrderHistory />)

    expect(screen.getByText(/carregando pedidos/i)).toBeInTheDocument()
  })

  it('renders orders list when loaded', () => {
    const mockOrders = [
      createMockOrder(1, 'ORD-001'),
      createMockOrder(2, 'ORD-002'),
    ]

    vi.mocked(useOrderHistoryPageHook.useOrderHistoryPage).mockReturnValue({
      orders: mockOrders,
      pagination: { page: 1, total_pages: 1 },
      loading: false,
      error: null,
      isOwner: false,
      startDate: '',
      setStartDate: vi.fn(),
      endDate: '',
      setEndDate: vi.fn(),
      status: '',
      setStatus: vi.fn(),
      handleFilterChange: vi.fn(),
      handlePageChange: vi.fn(),
      refetch: vi.fn(),
      loadMore: vi.fn(),
      hasMore: false,
    })

    render(<OrderHistory />)

    expect(screen.getByText(/#ORD-001/i)).toBeInTheDocument()
    expect(screen.getByText(/#ORD-002/i)).toBeInTheDocument()
  })

  it('renders empty state when no orders', () => {
    vi.mocked(useOrderHistoryPageHook.useOrderHistoryPage).mockReturnValue({
      orders: [],
      pagination: { page: 1, total_pages: 1 },
      loading: false,
      error: null,
      isOwner: false,
      startDate: '',
      setStartDate: vi.fn(),
      endDate: '',
      setEndDate: vi.fn(),
      status: '',
      setStatus: vi.fn(),
      handleFilterChange: vi.fn(),
      handlePageChange: vi.fn(),
      refetch: vi.fn(),
      loadMore: vi.fn(),
      hasMore: false,
    })

    render(<OrderHistory />)

    expect(screen.getByText(/nenhum pedido encontrado/i)).toBeInTheDocument()
  })

  describe('Infinite Scroll', () => {
    it('renders sentinel when there are orders and hasMore', () => {
      const mockOrders = [createMockOrder(1, 'ORD-001')]

      vi.mocked(useOrderHistoryPageHook.useOrderHistoryPage).mockReturnValue({
        orders: mockOrders,
        pagination: { page: 1, total_pages: 2 },
        loading: false,
        error: null,
        isOwner: false,
        startDate: '',
        setStartDate: vi.fn(),
        endDate: '',
        setEndDate: vi.fn(),
        status: '',
        setStatus: vi.fn(),
        handleFilterChange: vi.fn(),
        handlePageChange: vi.fn(),
        refetch: vi.fn(),
        loadMore: vi.fn(),
        hasMore: true,
      })

      render(<OrderHistory />)

      expect(screen.getByTestId('infinite-scroll-sentinel')).toBeInTheDocument()
    })

    it('does not render sentinel when hasMore is false', () => {
      const mockOrders = [createMockOrder(1, 'ORD-001')]

      vi.mocked(useOrderHistoryPageHook.useOrderHistoryPage).mockReturnValue({
        orders: mockOrders,
        pagination: { page: 1, total_pages: 1 },
        loading: false,
        error: null,
        isOwner: false,
        startDate: '',
        setStartDate: vi.fn(),
        endDate: '',
        setEndDate: vi.fn(),
        status: '',
        setStatus: vi.fn(),
        handleFilterChange: vi.fn(),
        handlePageChange: vi.fn(),
        refetch: vi.fn(),
        loadMore: vi.fn(),
        hasMore: false,
      })

      render(<OrderHistory />)

      expect(screen.queryByTestId('infinite-scroll-sentinel')).not.toBeInTheDocument()
    })

    it('does not render sentinel when no orders', () => {
      vi.mocked(useOrderHistoryPageHook.useOrderHistoryPage).mockReturnValue({
        orders: [],
        pagination: { page: 1, total_pages: 1 },
        loading: false,
        error: null,
        isOwner: false,
        startDate: '',
        setStartDate: vi.fn(),
        endDate: '',
        setEndDate: vi.fn(),
        status: '',
        setStatus: vi.fn(),
        handleFilterChange: vi.fn(),
        handlePageChange: vi.fn(),
        refetch: vi.fn(),
        loadMore: vi.fn(),
        hasMore: true,
      })

      render(<OrderHistory />)

      expect(screen.queryByTestId('infinite-scroll-sentinel')).not.toBeInTheDocument()
    })
  })
})
