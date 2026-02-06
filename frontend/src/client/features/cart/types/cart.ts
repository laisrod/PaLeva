export interface CartItem {
  id: number
  name: string
  description?: string
  price: number
  quantity: number
  portion?: string
  portionId?: number
  menuItemId?: number
  menuId?: number
  image?: string
}

export interface CartSidebarProps {
  cart: CartItem[]
  orderType: 'delivery' | 'takeaway'
  showCart: boolean
  onClose: () => void
  onUpdateQuantity: (itemId: number, portion: string | undefined, quantity: number) => void
  onRemoveItem: (itemId: number, portion: string | undefined) => void
  onToggleCart: () => void
  subtotal: number
  deliveryFee: number
  packagingFee: number
  total: number
  onCheckout: () => void
  checkoutLoading?: boolean
}
