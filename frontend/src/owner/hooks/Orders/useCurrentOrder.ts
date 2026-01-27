import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { Order, OrderMenuItem } from '../../../shared/types/order'
import { useCreateOrder } from './useCreateOrder'
import { UseCurrentOrderOptions } from '../../types/order'

export function useCurrentOrder({ establishmentCode, autoCreate = false }: UseCurrentOrderOptions) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { createOrder: createOrderHook, loading: creatingOrder } = useCreateOrder({
    establishmentCode,
    onSuccess: (order) => {
      // Quando um pedido é criado, precisamos buscar os detalhes completos
      loadOrder(order.code)
    }
  })

  // Carregar pedido pelo código
  const loadOrder = useCallback(async (orderCode: string) => {
    if (!establishmentCode) {
      setError('Código do estabelecimento não encontrado')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await ownerApi.getOrder(establishmentCode, orderCode)
      
      if (response.error) {
        setError(response.error as string)
        setCurrentOrder(null)
      } else if (response.data) {
        setCurrentOrder(response.data)
      }
    } catch (err) {
      setError('Erro ao carregar pedido')
      setCurrentOrder(null)
    } finally {
      setLoading(false)
    }
  }, [establishmentCode])

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

  // Carregar pedido do localStorage apenas uma vez ao montar o componente
  const [hasInitialized, setHasInitialized] = useState(false)
  useEffect(() => {
    if (establishmentCode && !hasInitialized) {
      const savedOrderCode = localStorage.getItem(`current_order_${establishmentCode}`)
      if (savedOrderCode) {
        loadOrder(savedOrderCode)
      }
      setHasInitialized(true)
    }
  }, [establishmentCode, hasInitialized, loadOrder])
  
  // Resetar flag quando establishmentCode mudar
  useEffect(() => {
    setHasInitialized(false)
  }, [establishmentCode])

  // Salvar código do pedido no localStorage quando mudar
  useEffect(() => {
    if (currentOrder && establishmentCode) {
      localStorage.setItem(`current_order_${establishmentCode}`, currentOrder.code)
    } else if (!currentOrder && establishmentCode) {
      localStorage.removeItem(`current_order_${establishmentCode}`)
    }
  }, [currentOrder, establishmentCode])

  const totals = calculateTotals()

  return {
    currentOrder,
    loading: loading || creatingOrder,
    error,
    createNewOrder,
    loadOrder,
    clearOrder,
    totals,
    itemsCount: currentOrder?.order_menu_items?.length || 0
  }
}
