import { useState, useEffect, useCallback, useRef } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { Order, OrderMenuItem } from '../../../../../shared/types/order'
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
        // A API pode retornar os dados diretamente ou dentro de uma chave 'order'
        // Verificar se os dados estão dentro de uma chave 'order'
        let newOrder = response.data
        if (response.data.order && typeof response.data.order === 'object') {
          newOrder = response.data.order
        } else if (!response.data.code && !response.data.id) {
          // Tentar encontrar a chave que contém o pedido
          const possibleOrderKey = Object.keys(response.data).find(key => 
            response.data[key] && 
            typeof response.data[key] === 'object' && 
            (response.data[key].code || response.data[key].id)
          )
          if (possibleOrderKey) {
            newOrder = response.data[possibleOrderKey]
          }
        }
        
        // Validar se o newOrder tem code, se não tiver, usar o orderCode do parâmetro
        if (!newOrder.code) {
          // Usar o orderCode do parâmetro como fallback
          newOrder.code = orderCode
        }
        
        // Converter order_menu_items para array se necessário
        // O ActiveModel::Serializer com adapter :json pode retornar como objeto
        if (newOrder.order_menu_items && !Array.isArray(newOrder.order_menu_items)) {
          // Se for um objeto, converter valores para array
          if (typeof newOrder.order_menu_items === 'object' && newOrder.order_menu_items !== null) {
            newOrder.order_menu_items = Object.values(newOrder.order_menu_items)
          } else {
            newOrder.order_menu_items = []
          }
        } else if (!newOrder.order_menu_items) {
          // Se não existir, inicializar como array vazio
          newOrder.order_menu_items = []
        }
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
        
        
        // Se não for silent, SEMPRE atualizar para garantir sincronização
        // Se for silent, só atualizar se houver mudanças detectadas
        // IMPORTANTE: Se for o mesmo pedido mas com contagem diferente, sempre atualizar
        const shouldUpdate = !silent || changed || (curCode === newOrder.code && curCount !== newCount)
        
        if (shouldUpdate) {
          // Garantir que o code está presente antes de atualizar
          if (!newOrder.code && orderCode) {
            newOrder.code = orderCode
          }
          
          // Garantir que order_menu_items é um array
          if (!Array.isArray(newOrder.order_menu_items)) {
            newOrder.order_menu_items = []
          }
          
          setCurrentOrder(newOrder)
        } else {
          // Mesmo em modo silencioso, se não há currentOrder mas há um novo, atualizar
          if (!currentOrderRef.current && newOrder) {
            setCurrentOrder(newOrder)
          }
        }
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
    if (order && order.code && order.code !== 'undefined') {
      localStorage.setItem(`current_order_${establishmentCode}`, order.code)
      await loadOrder(order.code, false) // false = não silencioso, força atualização
    }
    return order
  }, [createOrderHook, establishmentCode, loadOrder])

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

    const subtotal = currentOrder.order_menu_items.reduce((sum: number, item: OrderMenuItem) => {
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
    // Validar se o valor salvo é válido
    if (saved && saved !== 'undefined' && saved !== 'null' && saved.trim() !== '') {
      loadOrder(saved, false) // false = não silencioso na inicialização
    } else if (saved && (saved === 'undefined' || saved === 'null')) {
      localStorage.removeItem(`current_order_${establishmentCode}`)
    }
  }, [establishmentCode, loadOrder])

  // Salvar código do pedido no localStorage quando tiver pedido (não remover ao montar com null)
  useEffect(() => {
    if (!establishmentCode) return
    if (currentOrder && currentOrder.code && currentOrder.code !== 'undefined' && currentOrder.code !== 'null') {
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
