import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { useApiData } from '../../../../shared/hooks/Api/useApiData'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'
import { Menu } from '../../types/menu'

export function useMenus(establishmentCode: string | undefined) {
  const [menus, setMenus] = useState<Menu[]>([])
  
  const { loading, error, executeRequest } = useApiData<Menu[]>({
    defaultErrorMessage: 'Erro ao carregar cardápios',
    onSuccess: (data) => setMenus(data)
  })

  const loadMenus = useCallback(async () => {
    if (!establishmentCode) {
      return
    }
    
    await executeRequest(() => ownerApi.getMenus(establishmentCode))
  }, [establishmentCode, executeRequest])

  useEffect(() => {
    if (establishmentCode) {
      loadMenus()
    }
  }, [establishmentCode])

  const deleteMenu = useCallback(async (menuId: number) => {
    if (!establishmentCode) {
      return
    }
    
    const userConfirmed = window.confirm('Tem certeza que deseja excluir este cardápio?')
    
    if (!userConfirmed) {
      return
    }
    
    try {
      const response = await ownerApi.deleteMenu(establishmentCode, menuId)
      const errorMessage = getErrorMessage(response)
      
      if (errorMessage) {
        alert(errorMessage)
      } else {
        setMenus((previousMenus) => previousMenus.filter((menu) => menu.id !== menuId))
      }
    } catch (err) {
      alert('Erro ao excluir cardápio')
    }
  }, [establishmentCode])

  return {
    menus,
    loading,
    error,
    deleteMenu,
    refetch: loadMenus
  }
}
