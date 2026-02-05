import { useState, useEffect, useCallback } from 'react'
import { api } from '../../shared/services/api'
import { useApiData } from '../../owner/hooks/Api/useApiData'

export interface OrderHistoryItem {
  id: number
  code: string
  status: string
  total_price: number
  created_at: string
  updated_at: string
  establishment: {
    id: number
    code: string
    name: string
  }
  customer?: {
    id?: number
    name?: string
    email?: string
    phone?: string
  }
  order_menu_items?: Array<{
    id: number
    quantity: number
    menu?: {
      id: number
      name: string
      price: number
    }
    menu_item?: {
      id: number
      name: string
    }
    portion?: {
      id: number
      description: string
      price: number
    }
  }>
}

export interface OrderHistoryFilters {
  status?: string
  start_date?: string
  end_date?: string
  page?: number
  per_page?: number
}

export interface OrderHistoryPagination {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface UseOrderHistoryReturn {
  orders: OrderHistoryItem[]
  pagination: OrderHistoryPagination | null
  loading: boolean
  error: string | null
  filters: OrderHistoryFilters
  setFilters: (filters: Partial<OrderHistoryFilters>) => void
  fetchOrders: () => Promise<void>
  refetch: () => Promise<void>
}

export function useOrderHistory(initialFilters?: OrderHistoryFilters): UseOrderHistoryReturn {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([])
  const [pagination, setPagination] = useState<OrderHistoryPagination | null>(null)
  const [filters, setFiltersState] = useState<OrderHistoryFilters>({
    page: 1,
    per_page: 20,
    ...initialFilters,
  })

  const { loading, error, executeRequest, setError, setLoading } = useApiData<{
    orders: OrderHistoryItem[]
    pagination: OrderHistoryPagination
  }>({
    defaultErrorMessage: 'Erro ao carregar histórico de pedidos',
    onSuccess: (data) => {
      setOrders(data.orders || [])
      setPagination(data.pagination || null)
    },
  })

  const fetchOrders = useCallback(async () => {
    await executeRequest(
      async () => {
        const response = await api.getOrderHistory(filters)
        if (response.data) {
          return { data: response.data }
        }
        return response as { data?: { orders: OrderHistoryItem[]; pagination: OrderHistoryPagination }, error?: string | string[] }
      },
      'Erro ao carregar histórico de pedidos.'
    )
  }, [filters, executeRequest])

  const setFilters = useCallback((newFilters: Partial<OrderHistoryFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const refetch = useCallback(async () => {
    await fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    fetchOrders,
    refetch,
  }
}
