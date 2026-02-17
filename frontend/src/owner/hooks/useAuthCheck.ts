import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

//protege as rotas que precisam de autenticação
//se não tiver token, redireciona para a página de login
export function useAuthCheck(redirectPath: string = '/login'): boolean {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate(redirectPath)
    }
  }, [navigate, redirectPath])

  const token = localStorage.getItem('auth_token')
  return !!token
}
