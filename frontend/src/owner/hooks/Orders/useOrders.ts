import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { Order } from '../../../shared/types/order'
import { useApiData } from '../useApiData'
import { getErrorMessage } from '../errorHandler'

type OrderAction = 'prepare' | 'ready' | 'cancel'

export function useOrders(establishmentCode: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([])
  
  const { loading, error, executeRequest } = useApiData<Order[]>({
    defaultErrorMessage: 'Erro ao carregar pedidos',
    onSuccess: (data) => setOrders(data)
  })

  const loadOrders = useCallback(async () => {
    if (!establishmentCode) {
      return
    }
    
    await executeRequest(() => ownerApi.getOrders(establishmentCode))
  }, [establishmentCode, executeRequest])

  useEffect(() => {
    if (establishmentCode) {
      loadOrders()
    }
  }, [establishmentCode])

  const changeStatus = useCallback(async (
    orderCode: string, 
    action: OrderAction
  ) => {
    if (!establishmentCode) {
      return
    }

    try {
      let response

      if (action === 'prepare') {
        response = await ownerApi.prepareOrder(establishmentCode, orderCode)
      } else if (action === 'ready') {
        response = await ownerApi.readyOrder(establishmentCode, orderCode)
      } else if (action === 'cancel') {
        response = await ownerApi.cancelOrder(establishmentCode, orderCode)
      }

      if (!response) {
        return
      }

      const errorMessage = getErrorMessage(response)
      
      if (errorMessage) {
        alert(errorMessage)
      } else {
        loadOrders()
      }
    } catch (err) {
      alert('Erro ao atualizar pedido')
    }
  }, [establishmentCode, loadOrders])

  return {
    orders,
    loading,
    error,
    changeStatus,
    refetch: loadOrders
  }
}
