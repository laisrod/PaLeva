import { useState, useEffect } from 'react'
import { api } from '../../shared/services/api'

interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  weight?: string
  pieces?: string
  image?: string
  category?: string
  menu_item_id?: number
  average_rating?: number
  ratings_count?: number
  portions?: Array<{
    id: number
    name: string
    price: number
  }>
}

export function useMenu(establishmentCode: string | undefined) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (establishmentCode) {
      loadMenu()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishmentCode])

  const loadMenu = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await api.getPublicMenu(establishmentCode!)
      
      if (response.error) {
        console.error('Erro ao carregar menu:', response.error)
        setError('Erro ao carregar menu')
        return
      }

      if (response.data?.menu) {
        const menuData = response.data.menu
        const items: MenuItem[] = menuData.items.map((item: any, index: number) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.min_price || item.price || 0,
          category: item.category || 'Geral',
          menu_item_id: item.menu_item_id || index + 1,
          portions: item.portions || [],
          image: item.photo_url || item.image,
          average_rating: item.average_rating || 0,
          ratings_count: item.ratings_count || 0
        }))

        const uniqueCategories = Array.from(new Set(
          items
            .map(item => item.category)
            .filter((category): category is string => category !== undefined)
        ))
        
        setCategories(uniqueCategories.length > 0 ? uniqueCategories : ['Geral'])
        setMenuItems(items)
        setSelectedCategory(uniqueCategories[0] || 'Geral')
      }
    } catch (err) {
      console.error('Erro ao carregar menu:', err)
      setError('Erro ao carregar menu')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems

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

