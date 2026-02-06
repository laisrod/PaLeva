import { useLocation } from 'react-router-dom'

export function useBottomNavigation() {
  const location = useLocation()

  const isActive = (path: string): boolean => {
    return location.pathname.includes(path)
  }

  return {
    isActive
  }
}
