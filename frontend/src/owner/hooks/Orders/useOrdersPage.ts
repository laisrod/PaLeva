import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth'
import { useAuth } from '../../../shared/hooks/useAuth'
import { useOrders } from './useOrders'
import { useCurrentOrder } from './useCurrentOrder'
import { useAddOrderItem } from './useAddOrderItem'
import { useOrderForm } from './useOrderForm'
import { useMenus } from '../Menu/useMenus'
import { useMenuItems } from '../Menu/useMenuItems'
import { useDishes } from '../Dish/useDishes'
import { useDrinks } from '../Drink/useDrinks'
import { useDishPortions } from '../DishPortion/useDishPortions'
import { useDrinkPortions } from '../DrinkPortion/useDrinkPortions'
import { ownerApi } from '../../services/api'

export function useOrdersPage() {
  useRequireAuth()
  const { code } = useParams<{ code: string }>()
  const { user } = useAuth()
  const establishmentCode = code || user?.establishment?.code || localStorage.getItem('establishment_code') || undefined
  
  const orderFormRef = useRef<HTMLDivElement>(null)

  const { 
    currentOrder, 
    loading: loadingCurrentOrder, 
    error: currentOrderError, 
    createNewOrder, 
    clearOrder,
    loadOrder,
    totals,
    itemsCount
  } = useCurrentOrder({
    establishmentCode: establishmentCode,
    autoCreate: false
  })

  const {
    showCreateOrder,
    selectedMenuId,
    selectedDishId,
    selectedDrinkId,
    handleCreateOrder: handleCreateOrderForm,
    handleClearOrder,
    handleSelectMenu,
    handleToggleDish,
    handleToggleDrink,
    handleSelectDishPortion,
    handleSelectDrinkPortion,
    handleSelectMenuItem,
  } = useOrderForm()

  const { orders, loading: loadingOrders, error: ordersError, changeStatus, deleteOrder, refetch: refetchOrders } = useOrders(establishmentCode, {
    onMissingContactInfo: async (orderCode: string) => {
      await loadOrder(orderCode)
      setTimeout(() => {
        orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  })

  const { menus, loading: loadingMenus } = useMenus(establishmentCode)
  const { menuItems, loading: loadingMenuItems } = useMenuItems({
    menuId: selectedMenuId,
    establishmentCode: establishmentCode
  })
  const { dishes, loading: loadingDishes, error: dishesError } = useDishes(establishmentCode)
  const { drinks, loading: loadingDrinks, error: drinksError } = useDrinks(establishmentCode)
  const { portions: dishPortions, loading: loadingDishPortions } = useDishPortions(establishmentCode, selectedDishId)
  const { portions: drinkPortions, loading: loadingDrinkPortions } = useDrinkPortions(establishmentCode, selectedDrinkId)

  const { addItem, loading: addingItem, error: addItemError } = useAddOrderItem({
    establishmentCode: establishmentCode,
    orderCode: currentOrder?.code,
    onSuccess: () => {
      if (currentOrder) {
        loadOrder(currentOrder.code)
      }
    }
  })

  const [customerInfo, setCustomerInfo] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_cpf: ''
  })
  const [updatingOrder, setUpdatingOrder] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)

  // Inicializar informações do cliente quando o pedido carregar
  useEffect(() => {
    if (currentOrder) {
      setCustomerInfo({
        customer_name: currentOrder.customer_name || '',
        customer_email: currentOrder.customer_email || '',
        customer_phone: currentOrder.customer_phone || '',
        customer_cpf: currentOrder.customer_cpf || ''
      })
    }
  }, [currentOrder])

  const handleCreateOrder = () => {
    handleCreateOrderForm(createNewOrder)
  }

  const handleClearOrderAndForm = () => {
    handleClearOrder()
    clearOrder()
  }

  const handleUpdateCustomerInfo = async () => {
    if (!currentOrder || !establishmentCode) return

    if (!customerInfo.customer_email && !customerInfo.customer_phone) {
      alert('É necessário informar pelo menos um email ou telefone')
      return
    }

    setUpdatingOrder(true)
    try {
      const response = await ownerApi.updateOrder(establishmentCode, currentOrder.code, customerInfo)
      if (response.error) {
        alert(response.error)
      } else {
        await refetchOrders()
        clearOrder()
        handleClearOrder()
        alert('Informações do cliente atualizadas!')
      }
    } catch (err) {
      alert('Erro ao atualizar informações do cliente')
    } finally {
      setUpdatingOrder(false)
    }
  }

  const handleSaveOrder = () => {
    if (!currentOrder || !establishmentCode) return

    if (!currentOrder.order_menu_items || currentOrder.order_menu_items.length === 0) {
      alert('Adicione pelo menos um item ao pedido antes de salvar')
      return
    }

    setShowCustomerModal(true)
  }

  const handleConfirmSaveOrder = async () => {
    if (!currentOrder || !establishmentCode) return

    if (!customerInfo.customer_email && !customerInfo.customer_phone) {
      alert('É necessário informar pelo menos um email ou telefone para salvar o pedido')
      return
    }

    setUpdatingOrder(true)
    try {
      const updateResponse = await ownerApi.updateOrder(establishmentCode, currentOrder.code, customerInfo)
      if (updateResponse.error) {
        alert(updateResponse.error)
        return
      }

      if (currentOrder.status === 'draft' || !currentOrder.status) {
        await changeStatus(currentOrder.code, 'confirm')
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      setShowCustomerModal(false)
      await refetchOrders()
      clearOrder()
      handleClearOrder()
      alert('Pedido salvo com sucesso!')
    } catch (err) {
      alert('Erro ao salvar pedido')
    } finally {
      setUpdatingOrder(false)
    }
  }

  return {
    // Establishment
    establishmentCode,
    
    // Current Order
    currentOrder,
    loadingCurrentOrder,
    currentOrderError,
    totals,
    itemsCount,
    orderFormRef,
    
    // Orders List
    orders,
    loadingOrders,
    ordersError,
    changeStatus,
    deleteOrder,
    
    // Order Form
    showCreateOrder,
    selectedMenuId,
    selectedDishId,
    selectedDrinkId,
    handleSelectMenu,
    handleToggleDish,
    handleToggleDrink,
    handleSelectDishPortion,
    handleSelectDrinkPortion,
    handleSelectMenuItem,
    
    menus,
    loadingMenus,
    
    menuItems,
    loadingMenuItems,
    
    dishes,
    loadingDishes,
    dishesError,
    
    drinks,
    loadingDrinks,
    drinksError,
    
    dishPortions,
    loadingDishPortions,
    drinkPortions,
    loadingDrinkPortions,
    
    addItem,
    addingItem,
    addItemError,
    
    customerInfo,
    setCustomerInfo,
    updatingOrder,
    showCustomerModal,
    setShowCustomerModal,
    
    handleCreateOrder,
    handleClearOrderAndForm,
    handleUpdateCustomerInfo,
    handleSaveOrder,
    handleConfirmSaveOrder,
  }
}
