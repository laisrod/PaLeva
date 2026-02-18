import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../../../../shared/services/api'
import { useCurrentOrder } from './useCurrentOrder'
import { useOrderUpdates } from './useOrderUpdates'
import { OrderSidebarProps } from '../../types/order'
import { Order } from '../../../../../shared/types/order'

const POLL_COOLDOWN_MS = 3000

export function useOrderSidebar({ establishmentCode }: OrderSidebarProps) {
  const navigate = useNavigate()
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [activeOrders, setActiveOrders] = useState<Order[]>([])
  const [loadingActiveOrders, setLoadingActiveOrders] = useState(false)
  
  const {
    currentOrder,
    loading,
    totals,
    itemsCount,
    loadOrder
  } = useCurrentOrder({
    establishmentCode,
    autoCreate: false
  })

  const loadOrderRef = useRef(loadOrder)
  useEffect(() => {
    loadOrderRef.current = loadOrder
  }, [loadOrder])

  // Buscar pedidos ativos quando não houver currentOrder
  const loadActiveOrders = useCallback(async () => {
    if (!establishmentCode || currentOrder) {
      setActiveOrders([])
      return
    }

    setLoadingActiveOrders(true)
    try {
      const response = await ownerApi.getOrders(establishmentCode)
      if (response.data && Array.isArray(response.data)) {
        // Filtrar apenas pedidos ativos (draft ou pending)
        const active = response.data.filter((order: Order) => 
          order.status === 'draft' || order.status === 'pending'
        )
        setActiveOrders(active)
      }
    } catch (error) {
      console.error('[useOrderSidebar] Erro ao carregar pedidos ativos:', error)
    } finally {
      setLoadingActiveOrders(false)
    }
  }, [establishmentCode, currentOrder])

  useEffect(() => {
    if (!establishmentCode) return

    let lastReload = 0

    const run = () => {
      const now = Date.now()
      if (now - lastReload < POLL_COOLDOWN_MS) return

      const saved = localStorage.getItem(`current_order_${establishmentCode}`)
      // Validar se o valor salvo é válido (não 'undefined', null, ou vazio)
      if (!saved || saved === 'undefined' || saved === 'null' || saved.trim() === '') {
        // Se não há pedido salvo válido, limpar e carregar pedidos ativos
        if (saved && (saved === 'undefined' || saved === 'null')) {
          localStorage.removeItem(`current_order_${establishmentCode}`)
        }
        loadActiveOrders()
        return
      }

      const same = currentOrder?.code === saved
      lastReload = now
      // Se for o mesmo pedido, usar silent: true para evitar loading desnecessário
      // Se for diferente, usar silent: false para forçar atualização
      loadOrderRef.current(saved, same) // same = silent (true se for o mesmo, false se for diferente)
    }

    run()
    const t = setInterval(run, POLL_COOLDOWN_MS)
    return () => clearInterval(t)
  }, [establishmentCode, currentOrder?.code, loadActiveOrders])

  // Carregar pedidos ativos quando não houver currentOrder
  useEffect(() => {
    if (!currentOrder && establishmentCode) {
      loadActiveOrders()
    } else {
      setActiveOrders([])
    }
  }, [currentOrder, establishmentCode, loadActiveOrders])

  useEffect(() => {
    if (!establishmentCode) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `current_order_${establishmentCode}` && e.newValue) {
        loadOrderRef.current(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [establishmentCode])

  const handleGoToOrders = () => {
    if (establishmentCode) {
      navigate(`/establishment/${establishmentCode}/orders`)
    }
  }

  // Integrar atualizações em tempo real
  useOrderUpdates({
    establishmentCode: establishmentCode || 'string',
    enabled: !!establishmentCode && !!currentOrder,
    onOrderUpdated: (order: Order) => {
      // Se for o pedido atual, recarregar
      if (currentOrder?.code === order.code) {
        loadOrder(order.code, true)
      }
    },
    onOrderStatusChanged: (order: Order) => {
      // Se for o pedido atual, recarregar
      if (currentOrder?.code === order.code) {
        loadOrder(order.code, true)
      }
    },
  })

  const handleRemoveItem = useCallback(
    async (itemId: number) => {
      if (!establishmentCode || !currentOrder?.code) return
      setRemovingId(itemId)
      try {
        const res = await ownerApi.removeOrderItem(
          establishmentCode,
          currentOrder.code,
          itemId
        )
        if (res.error) return
        ownerApi.invalidateOrderCache(establishmentCode, currentOrder.code)
        await loadOrder(currentOrder.code, true)
      } finally {
        setRemovingId(null)
      }
    },
    [establishmentCode, currentOrder?.code, loadOrder]
  )

  // Calcular soma total dos pedidos ativos
  const activeOrdersTotal = activeOrders.reduce((sum, order) => {
    const total = typeof order.total_price === 'number' ? order.total_price : Number(order.total_price) || 0
    return sum + total
  }, 0)

  return {
    establishmentCode,
    currentOrder,
    loading: loading || loadingActiveOrders,
    totals,
    itemsCount,
    handleGoToOrders,
    handleRemoveItem,
    removingId,
    activeOrders,
    activeOrdersTotal,
  }
}
