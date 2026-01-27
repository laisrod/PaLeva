import { useEffect } from 'react'
import { useAuth } from '../shared/hooks/useAuth'

export default function AuthListener() {
  const { checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return null
}
