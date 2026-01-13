import { BaseApiService } from './base'
import { MenuData } from '../types/menu'

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
}
