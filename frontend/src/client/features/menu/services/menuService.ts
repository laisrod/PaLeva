import { api } from '../../../../shared/services/api'

export interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  weight?: string
  pieces?: string
  image?: string
  category?: string
  menu_item_id?: number
  menu_id?: number
  average_rating?: number
  ratings_count?: number
  portions?: Array<{
    id: number
    name: string
    price: number
  }>
}

export interface MenuResponse {
  menu: {
    items: any[]
  }
}

/**
 * Busca o menu público de um estabelecimento
 * @param establishmentCode - Código do estabelecimento
 * @returns Promise com os itens do menu
 */
export async function getPublicMenu(establishmentCode: string): Promise<MenuItem[]> {
  const response = await api.getPublicMenu(establishmentCode)
  
  if (response.error) {
    console.error('[menuService] API error:', response.error)
    throw new Error(response.error as string)
  }

  if (response.data?.menu) {
      const menuData = response.data.menu
      const items = menuData.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.min_price || item.price || 0,
        category: item.category || 'Geral',
        menu_item_id: item.menu_item_id,
        menu_id: item.menu_id,
        portions: item.portions || [],
        image: item.photo_url || item.image,
        average_rating: item.average_rating || 0,
        ratings_count: item.ratings_count || 0
      }))
      return items
  }

  return []
}
