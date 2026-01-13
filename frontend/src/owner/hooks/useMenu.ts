import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../services/api'
import { useApiData } from './useApiData'
import { Menu, MenuResponse, UseMenuOptions } from '../types/menu'

export function useMenu({ menuId, establishmentCode }: UseMenuOptions) {
  const [menu, setMenu] = useState<Menu | null>(null)
  
  const { loading, error, executeRequest } = useApiData<MenuResponse>({
    defaultErrorMessage: 'Erro ao carregar cardápio',
    onSuccess: (data) => {
      setMenu({
        id: data.id,
        name: data.name,
        description: data.description,
      })
    }
  })

  const loadMenu = useCallback(async (id: number, code: string) => {
    await executeRequest(() => ownerApi.getMenu(code, id))
  }, [executeRequest])

  useEffect(() => {
    if (menuId && establishmentCode) {
      loadMenu(menuId, establishmentCode)
    }
  }, [menuId, establishmentCode])

  return { 
    menu, 
    loading, 
    error 
  }
}
