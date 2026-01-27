import { useState, useEffect, useCallback, useRef } from 'react'
import { ownerApi } from '../../services/api'
import { Order, OrderMenuItem } from '../../../shared/types/order'
import { useCreateOrder } from './useCreateOrder'
import { UseCurrentOrderOptions } from '../../types/order'

export function useCurrentOrder({ establishmentCode, autoCreate = false }: UseCurrentOrderOptions) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentOrderRef = useRef<Order | null>(null)
  const loadingRef = useRef(false)
  const loadOrderRef = useRef<(code: string, silent?: boolean) => Promise<void>>(async () => {})

  const onCreateSuccess = useCallback((order: { code: string }) => {
    loadOrderRef.current(order.code)
  }, [])

  const { createOrder: createOrderHook, loading: creatingOrder } = useCreateOrder({
    establishmentCode,
    onSuccess: onCreateSuccess
  })
  useEffect(() => {
    currentOrderRef.current = currentOrder
  }, [currentOrder])
  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  /** Carregar pedido. silent: não altera loading (evita tremor ao dar refresh no mesmo pedido). */
  const loadOrder = useCallback(async (orderCode: string, silent = false) => {
    if (!establishmentCode) {
      setError('Código do estabelecimento não encontrado')
      return
    }

    if (currentOrderRef.current?.code === orderCode && loadingRef.current) return

    if (!silent) {
      setLoading(true)
      setError(null)
    }

    try {
      const response = await ownerApi.getOrder(establishmentCode, orderCode)

      if (response.error) {
        setError(response.error as string)
        setCurrentOrder(null)
      } else if (response.data) {
        const newOrder = response.data
        const cur = currentOrderRef.current
        const curCode = cur?.code
        const curCount = cur?.order_menu_items?.length ?? 0
        const newCount = newOrder.order_menu_items?.length ?? 0
        const curSig = (cur?.order_menu_items ?? [])
          .map((i: OrderMenuItem) => `${i.id}-${i.quantity}`)
          .sort()
          .join(',')
        const newSig = (newOrder.order_menu_items ?? [])
          .map((i: OrderMenuItem) => `${i.id}-${i.quantity}`)
          .sort()
          .join(',')
        const changed =
          curCode !== newOrder.code || curCount !== newCount || curSig !== newSig
        if (changed) setCurrentOrder(newOrder)
      }
    } catch {
      if (!silent) setError('Erro ao carregar pedido')
      setCurrentOrder(null)
    } finally {
      if (!silent) setLoading(false)
    }
  }, [establishmentCode])

  useEffect(() => {
    loadOrderRef.current = loadOrder
  }, [loadOrder])

  // Criar novo pedido draft
  const createNewOrder = useCallback(async (customerName?: string) => {
    const order = await createOrderHook(customerName)
    return order
  }, [createOrderHook])

  // Limpar pedido atual
  const clearOrder = useCallback(() => {
    if (establishmentCode) {
      localStorage.removeItem(`current_order_${establishmentCode}`)
    }
    setCurrentOrder(null)
    setError(null)
  }, [establishmentCode])

  // Calcular totais do pedido
  const calculateTotals = useCallback(() => {
    if (!currentOrder || !currentOrder.order_menu_items) {
      return {
        subtotal: 0,
        tax: 0,
        serviceFee: 0,
        total: 0
      }
    }

    const subtotal = currentOrder.order_menu_items.reduce((sum, item) => {
      const itemPrice = item.portion?.price || 0
      return sum + (itemPrice * item.quantity)
    }, 0)

    const serviceFee = subtotal * 0.05 // 5% taxa de serviço
    const tax = subtotal * 0.10 // 10% imposto
    const total = subtotal + serviceFee + tax

    return {
      subtotal,
      tax,
      serviceFee,
      total
    }
  }, [currentOrder])

  // Auto-criar pedido se necessário
  useEffect(() => {
    if (autoCreate && !currentOrder && !loading && !creatingOrder && establishmentCode) {
      createNewOrder()
    }
  }, [autoCreate, currentOrder, loading, creatingOrder, establishmentCode, createNewOrder])

  // Carregar pedido do localStorage só uma vez por establishment ao montar (evita loop)
  const loadedForEstablishment = useRef<string | null>(null)
  useEffect(() => {
    if (!establishmentCode) return
    if (loadedForEstablishment.current === establishmentCode) return
    loadedForEstablishment.current = establishmentCode

    const saved = localStorage.getItem(`current_order_${establishmentCode}`)
    if (saved) loadOrder(saved)
  }, [establishmentCode, loadOrder])

  // Salvar código do pedido no localStorage quando tiver pedido (não remover ao montar com null)
  useEffect(() => {
    if (!establishmentCode) return
    if (currentOrder) {
      localStorage.setItem(`current_order_${establishmentCode}`, currentOrder.code)
    }
    // Só removemos no clearOrder(); não apagar aqui evita perder o pedido ao trocar de tela
  }, [currentOrder, establishmentCode])

  const totals = calculateTotals()

  return {
    currentOrder,
    loading: loading || creatingOrder,
    creatingOrder,
    error,
    createNewOrder,
    loadOrder,
    clearOrder,
    totals,
    itemsCount: currentOrder?.order_menu_items?.length || 0
  }
}
