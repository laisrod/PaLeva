import { useState, useEffect } from 'react'
import { api } from '../../shared/services/api'
import { Order } from '../../shared/types/order'

export function useOrders(establishmentCode: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (establishmentCode) {
      loadOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishmentCode])

  const loadOrders = async () => {
    if (!establishmentCode) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await api.getOrders(establishmentCode)
      
      if (response.error) {
        setError(Array.isArray(response.error) 
          ? response.error.join(', ') 
          : response.error)
      } else if (response.data) {
        setOrders(response.data)
      }
    } catch (err) {
      setError('Erro ao carregar pedidos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const changeStatus = async (
    orderCode: string, 
    action: 'prepare' | 'ready' | 'cancel'
  ) => {
    if (!establishmentCode) return

    try {
      let response
      switch (action) {
        case 'prepare':
          response = await api.prepareOrder(establishmentCode, orderCode)
          break
        case 'ready':
          response = await api.readyOrder(establishmentCode, orderCode)
          break
        case 'cancel':
          response = await api.cancelOrder(establishmentCode, orderCode)
          break
      }

      if (!response.error) {
        loadOrders() // Recarregar lista
      } else {
        alert(response.error)
      }
    } catch (err) {
      alert('Erro ao atualizar pedido')
      console.error(err)
    }
  }

  return {
    orders,
    loading,
    error,
    changeStatus,
    refetch: loadOrders
  }
}

