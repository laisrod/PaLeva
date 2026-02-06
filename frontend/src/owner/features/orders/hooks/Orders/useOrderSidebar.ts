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

  useEffect(() => {
    if (!establishmentCode) return

    let lastReload = 0

    const run = () => {
      const now = Date.now()
      if (now - lastReload < POLL_COOLDOWN_MS) return

      const saved = localStorage.getItem(`current_order_${establishmentCode}`)
      if (!saved) return

      const same = currentOrder?.code === saved
      lastReload = now
      loadOrderRef.current(saved, same)
    }

    run()
    const t = setInterval(run, POLL_COOLDOWN_MS)
    return () => clearInterval(t)
  }, [establishmentCode, currentOrder?.code])

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

  return {
    establishmentCode,
    currentOrder,
    loading,
    totals,
    itemsCount,
    handleGoToOrders,
    handleRemoveItem,
    removingId,
  }
}
