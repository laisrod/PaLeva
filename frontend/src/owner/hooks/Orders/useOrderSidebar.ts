import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentOrder } from './useCurrentOrder'
import { OrderSidebarProps } from '../../types/order'

const POLL_COOLDOWN_MS = 3000

export function useOrderSidebar({ establishmentCode }: OrderSidebarProps) {
  const navigate = useNavigate()
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

  return {
    establishmentCode,
    currentOrder,
    loading,
    totals,
    itemsCount,
    handleGoToOrders,
  }
}
