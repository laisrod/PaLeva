export interface NavigationProps {
  orderType?: 'delivery' | 'takeaway'
  onOrderTypeChange?: (type: 'delivery' | 'takeaway') => void
  location?: string
  onLocationChange?: (location: string) => void
  cartItemCount?: number
  onCartClick?: () => void
}
