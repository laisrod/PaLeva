import { BaseApiService } from './base'
import { MenuData } from '../../types/menu'

export class MenusApi extends BaseApiService {
  async getMenus(establishmentCode: string) {
    return this.request<Array<{
      id: number
      name: string
      description: string
    }>>(`/establishments/${establishmentCode}/menus`)
  }

  async getMenu(establishmentCode: string, menuId: number) {
    return this.request<{
      id: number
      name: string
      description: string
      price?: number
      menu_items?: Array<{
        id: number
        dish: {
          id: number
          name: string
          description: string
          photo_url?: string
          portions: Array<{
            id: number
            description: string
            price: number
          }>
        } | null
        drink: {
          id: number
          name: string
          description: string
          photo_url?: string
          portions: Array<{
            id: number
            description: string
            price: number
          }>
        } | null
      }>
    }>(`/establishments/${establishmentCode}/menus/${menuId}`)
  }

  async createMenu(establishmentCode: string, menuData: MenuData) {
    return this.request<{
      menu: {
        id: number
        name: string
        description: string
      }
      message: string
    }>(`/establishments/${establishmentCode}/menus`, {
      method: 'POST',
      body: JSON.stringify({ menu: menuData }),
    })
  }

  async updateMenu(establishmentCode: string, menuId: number, menuData: MenuData) {
    return this.request<{
      menu: {
        id: number
        name: string
        description: string
      }
      message: string
    }>(`/establishments/${establishmentCode}/menus/${menuId}`, {
      method: 'PATCH',
      body: JSON.stringify({ menu: menuData }),
    })
  }

  async deleteMenu(establishmentCode: string, menuId: number) {
    return this.request<{ message: string }>(`/establishments/${establishmentCode}/menus/${menuId}`, {
      method: 'DELETE',
    })
  }

  async createMenuItem(establishmentCode: string, menuId: number, menuItemData: { dish_id?: number; drink_id?: number; portion_ids?: number[] }) {
    return this.request<{
      menu_item: {
        id: number
        dish: {
          id: number
          name: string
          description: string
        } | null
        drink: {
          id: number
          name: string
          description: string
        } | null
      }
      message: string
    }>(`/establishments/${establishmentCode}/menus/${menuId}/menu_items`, {
      method: 'POST',
      body: JSON.stringify({ menu_item: menuItemData }),
    })
  }

  async updateMenuItem(establishmentCode: string, menuId: number, menuItemId: number, portionIds: number[]) {
    return this.request<{
      menu_item: {
        id: number
        dish: {
          id: number
          name: string
          description: string
        } | null
        drink: {
          id: number
          name: string
          description: string
        } | null
      }
      message: string
    }>(`/establishments/${establishmentCode}/menus/${menuId}/menu_items/${menuItemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ menu_item: { portion_ids: portionIds } }),
    })
  }

  async deleteMenuItem(establishmentCode: string, menuId: number, menuItemId: number) {
    return this.request<{ message: string }>(`/establishments/${establishmentCode}/menus/${menuId}/menu_items/${menuItemId}`, {
      method: 'DELETE',
    })
  }
}
