import { ReactNode, useEffect } from 'react'
import Navigation from '../components/Navigation'
import BottomNavigation from '../components/BottomNavigation'
import { NavigationProps } from '../types/navigation'
import '../../../css/shared/ClientTheme.css'

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
  useEffect(() => {
    document.body.classList.add('client-theme-active')
    return () => {
      document.body.classList.remove('client-theme-active')
    }
  }, [])

  return (
    <div className="client-theme">
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
    </div>
  )
}
