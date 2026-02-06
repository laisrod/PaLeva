import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { useApiData } from '../../../../shared/hooks/Api/useApiData'
import { MenuItemWithPortions, MenuResponse, UseMenuItemsOptions } from '../../types/menu'

export function useMenuItems({ menuId, establishmentCode }: UseMenuItemsOptions) {
  const [menuItems, setMenuItems] = useState<MenuItemWithPortions[]>([])
  const [menuName, setMenuName] = useState<string>('')
  
  const { loading, error, executeRequest } = useApiData<MenuResponse>({
    defaultErrorMessage: 'Erro ao carregar itens do cardápio',
    onSuccess: (data) => {
      console.log('[useMenuItems] Dados recebidos:', data)
      console.log('[useMenuItems] menu_items:', data.menu_items)
      setMenuName(data.name || '')
      setMenuItems(data.menu_items || [])
    }
  })

  const loadMenuItems = useCallback(async (id: number, code: string) => {
    await executeRequest(() => ownerApi.getMenu(code, id))
  }, [executeRequest])

  useEffect(() => {
    if (menuId && establishmentCode) {
      loadMenuItems(menuId, establishmentCode)
    }
  }, [menuId, establishmentCode, loadMenuItems])

  return { 
    menuItems, 
    menuName,
    loading, 
    error,
    refetch: () => {
      if (menuId && establishmentCode) {
        loadMenuItems(menuId, establishmentCode)
      }
    }
  }
}
