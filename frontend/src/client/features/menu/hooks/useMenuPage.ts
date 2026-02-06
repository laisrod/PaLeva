import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMenu } from './useMenu'
import { useCart } from '../../cart/contexts/CartContext'
import { createPublicOrder } from '../../orders/services/orderService'
import { APP_CONFIG } from '../../../shared/constants/appConstants'
import { OrderType, CheckoutData } from '../types/menuPage'

export function useMenuPage() {
  const { code } = useParams<{ code: string }>()
  const [orderType, setOrderType] = useState<OrderType>(APP_CONFIG.DELIVERY.DEFAULT_TYPE)
  const [location, setLocation] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const { menuItems, categories, selectedCategory, setSelectedCategory, loading } = useMenu(code)
  const { cart, cartTotal, cartItemCount, addToCart, updateQuantity, removeFromCart, clearCart } = useCart()
  
  const deliveryFee = orderType === 'delivery' ? APP_CONFIG.DELIVERY.FEE : 0
  const packagingFee = APP_CONFIG.PACKAGING.FEE
  const total = cartTotal + deliveryFee + packagingFee

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Adicione itens ao carrinho antes de finalizar o pedido')
      return
    }

    if (!code) {
      alert('Código do estabelecimento não encontrado')
      return
    }

    // Solicitar dados do cliente
    const customerName = prompt('Nome completo:')
    if (!customerName) return

    const customerEmail = prompt('Email (opcional):') || undefined
    const customerPhone = prompt('Telefone (opcional):') || undefined

    if (!customerEmail && !customerPhone) {
      alert('É necessário informar pelo menos um email ou telefone')
      return
    }

    setCheckoutLoading(true)

    try {
      // Preparar itens do pedido
      const items = cart.map(item => {
        if (item.menuId) {
          // Se é um menu, enviar menu_id
          return {
            menu_id: item.menuId,
            quantity: item.quantity
          }
        } else {
          // Se é um item individual, enviar menu_item_id e portion_id
          return {
            menu_item_id: item.menuItemId || item.id,
            portion_id: item.portionId || 1,
            quantity: item.quantity
          }
        }
      })

      const checkoutData: CheckoutData = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        items: items
      }

      const response = await createPublicOrder(code, checkoutData)

      if (response.error) {
        alert(`Erro ao criar pedido: ${response.error}`)
      } else {
        alert('Pedido criado com sucesso!')
        clearCart()
        setShowCart(false)
      }
    } catch (error) {
      alert('Erro ao processar pedido')
      console.error(error)
    } finally {
      setCheckoutLoading(false)
    }
  }

  return {
    code,
    orderType,
    setOrderType,
    location,
    setLocation,
    showCart,
    setShowCart,
    checkoutLoading,
    menuItems,
    categories,
    selectedCategory,
    setSelectedCategory,
    loading,
    cart,
    cartTotal,
    cartItemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    deliveryFee,
    packagingFee,
    total,
    handleCheckout
  }
}

