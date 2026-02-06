import { ReactNode } from 'react'
import Navigation from '../components/Navigation'
import BottomNavigation from '../components/BottomNavigation'
import { NavigationProps } from '../types/navigation'

interface ClientLayoutProps extends Omit<NavigationProps, 'cartItemCount' | 'onCartClick'> {
  children: ReactNode
  cartItemCount?: number
  onCartClick?: () => void
}

export default function ClientLayout({
  children,
  orderType,
  onOrderTypeChange,
  location,
  onLocationChange,
  cartItemCount = 0,
  onCartClick
}: ClientLayoutProps) {
  return (
    <>
      <Navigation
        orderType={orderType}
        onOrderTypeChange={onOrderTypeChange}
        location={location}
        onLocationChange={onLocationChange}
        cartItemCount={cartItemCount}
        onCartClick={onCartClick}
      />
      {children}
      <BottomNavigation />
    </>
  )
}
