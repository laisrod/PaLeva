import { useState } from 'react'

export interface CartItem {
  id: number
  name: string
  description?: string
  price: number
  quantity: number
  portion?: string
  portionId?: number
  menuItemId?: number
  image?: string
}

interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  menu_item_id?: number
  image?: string
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: MenuItem, portion?: { id: number; name: string; price: number }) => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: portion?.price || item.price,
      quantity: 1,
      portion: portion?.name,
      portionId: portion?.id,
      menuItemId: item.menu_item_id || item.id,
      image: item.image
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(
        cartItem => cartItem.id === item.id && cartItem.portion === portion?.name
      )

      if (existingItem) {
        return prevCart.map(item =>
          item.id === existingItem.id && item.portion === existingItem.portion
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prevCart, cartItem]
    })
  }

  const updateQuantity = (itemId: number, portion: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, portion)
      return
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId && item.portion === portion
          ? { ...item, quantity }
          : item
      )
    )
  }

  const removeFromCart = (itemId: number, portion: string | undefined) => {
    setCart(prevCart =>
      prevCart.filter(item => !(item.id === itemId && item.portion === portion))
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return {
    cart,
    cartTotal,
    cartItemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  }
}

