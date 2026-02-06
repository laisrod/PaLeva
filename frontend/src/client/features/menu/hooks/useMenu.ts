import { useState, useEffect } from 'react'
import { getPublicMenu, MenuItem } from '../services/menuService'

export function useMenu(establishmentCode: string | undefined) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (establishmentCode) {
      loadMenu()
    } else {
      console.warn('[useMenu] No establishment code provided!')
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishmentCode])

  const loadMenu = async () => {
    setLoading(true)
    setError('')
    
    try {
      const items = await getPublicMenu(establishmentCode!)
      
      const uniqueCategories = Array.from(new Set(
        items
          .map(item => item.category)
          .filter((category): category is string => category !== undefined && category !== null && category !== '')
      ))
      
      if (items.length === 0) {
        console.warn('[useMenu] Nenhum item retornado da API!')
        setCategories(['Todos'])
        setMenuItems([])
        setSelectedCategory('Todos')
      } else {
        // Sempre adicionar 'Todos' como primeira opção para mostrar todos os itens
        const finalCategories = uniqueCategories.length > 0 
          ? ['Todos', ...uniqueCategories] 
          : ['Todos']
        setCategories(finalCategories)
        setMenuItems(items)
        // Sempre começar com 'Todos' para mostrar todos os itens
        setSelectedCategory('Todos')
      }
    } catch (err) {
      console.error('Erro ao carregar menu:', err)
      setError('Erro ao carregar menu')
    } finally {
      setLoading(false)
    }
  }

  // Filtrar por categoria, mas mostrar todos se a categoria for 'Todos' ou 'Geral'
  const filteredItems = (selectedCategory && selectedCategory !== '' && menuItems.length > 0 && selectedCategory !== 'Todos' && selectedCategory !== 'Geral')
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems // Mostrar todos os itens se não houver categoria selecionada ou se for 'Todos'/'Geral'

  // Logs apenas quando necessário para debug
  if (filteredItems.length === 0 && menuItems.length > 0) {
    console.warn('[useMenu] No items filtered!', {
      selectedCategory,
      totalItems: menuItems.length,
      categories: [...new Set(menuItems.map(i => i.category))],
      items: menuItems.map(i => ({ name: i.name, category: i.category }))
    })
  }

  return {
    menuItems: filteredItems,
    allMenuItems: menuItems,
    categories,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    refetch: loadMenu
  }
}

