import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { Order } from '../../../shared/types/order'
import { useApiData } from '../Api/useApiData'
import { getErrorMessage } from '../errorHandler'

type OrderAction = 'confirm' | 'prepare' | 'ready' | 'deliver' | 'cancel'

interface UseOrdersOptions {
  onMissingContactInfo?: (orderCode: string) => void
}

export function useOrders(establishmentCode: string | undefined, options?: UseOrdersOptions) {
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

      if (action === 'confirm') {
        response = await ownerApi.confirmOrder(establishmentCode, orderCode)
      } else if (action === 'prepare') {
        response = await ownerApi.prepareOrder(establishmentCode, orderCode)
      } else if (action === 'ready') {
        response = await ownerApi.readyOrder(establishmentCode, orderCode)
      } else if (action === 'deliver') {
        response = await ownerApi.deliverOrder(establishmentCode, orderCode)
      } else if (action === 'cancel') {
        response = await ownerApi.cancelOrder(establishmentCode, orderCode)
      }

      if (!response) {
        return
      }

      const errorMessage = getErrorMessage(response)
      
      if (errorMessage) {
        // Verificar se é erro de falta de email/telefone
        if (errorMessage.includes('telefone ou email') || errorMessage.includes('email ou telefone')) {
          // Chamar callback para carregar o pedido no formulário
          if (options?.onMissingContactInfo) {
            options.onMissingContactInfo(orderCode)
          } else {
            alert(errorMessage)
          }
        } else {
          alert(errorMessage)
        }
      } else {
        loadOrders()
      }
    } catch (err) {
      alert('Erro ao atualizar pedido')
    }
  }, [establishmentCode, loadOrders, options])

  const deleteOrder = useCallback(async (orderCode: string) => {
    if (!establishmentCode) {
      return
    }

    try {
      const response = await ownerApi.deleteOrder(establishmentCode, orderCode)
      const errorMessage = getErrorMessage(response)
      
      if (errorMessage) {
        alert(errorMessage)
      } else {
        loadOrders()
      }
    } catch (err) {
      alert('Erro ao deletar pedido')
    }
  }, [establishmentCode, loadOrders])

  return {
    orders,
    loading,
    error,
    changeStatus,
    deleteOrder,
    refetch: loadOrders
  }
}
