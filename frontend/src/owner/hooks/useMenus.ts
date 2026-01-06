import { useState, useEffect } from 'react'
import { api } from '../../shared/services/api'

interface Menu {
  id: number
  name: string
  description: string
}

export function useMenus(establishmentCode: string | undefined) {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (establishmentCode) {
      loadMenus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishmentCode])

  const loadMenus = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await api.getMenus(establishmentCode!)
      
      if (response.error) {
        setError(Array.isArray(response.error) 
          ? response.error.join(', ') 
          : response.error)
      } else if (response.data) {
        setMenus(response.data)
      }
    } catch (err) {
      setError('Erro ao carregar cardápios')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteMenu = async (menuId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este cardápio?')) return
    
    try {
      const response = await api.deleteMenu(menuId)
      
      if (response.error) {
        alert(response.error)
      } else {
        setMenus(menus.filter(m => m.id !== menuId))
      }
    } catch (err) {
      alert('Erro ao excluir cardápio')
      console.error(err)
    }
  }

  return {
    menus,
    loading,
    error,
    deleteMenu,
    refetch: loadMenus
  }
}

