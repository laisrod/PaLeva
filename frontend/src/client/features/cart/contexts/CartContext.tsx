import { createContext, useContext, useState, ReactNode } from 'react'
import { CartItem } from '../types/cart'
import { Product, ProductPortion } from '../../menu/types/product'

// Re-export CartItem type for convenience
export type { CartItem }

interface CartContextType {
  cart: CartItem[]
  cartTotal: number
  cartItemCount: number
  addToCart: (item: Product, portion?: ProductPortion) => void
  updateQuantity: (itemId: number, portion: string | undefined, quantity: number) => void
  removeFromCart: (itemId: number, portion: string | undefined) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: Product, portion?: ProductPortion) => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: portion?.price || item.price,
      quantity: 1,
      portion: portion?.name,
      portionId: portion?.id,
      menuItemId: item.menu_id ? undefined : (item.menu_item_id || item.id),
      menuId: item.menu_id,
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

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        cartItemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
