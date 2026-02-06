import { BaseApiService } from '../../../shared/services/api/base'
import { OrderMenuItem } from '../../../../shared/types/order'

export class OrderItemsApi extends BaseApiService {
  async addItem(
    establishmentCode: string,
    orderCode: string,
    options: {
      menuItemId?: number
      dishId?: number
      drinkId?: number
      portionId?: number
      menuId?: number
      quantity?: number
    }
  ) {
    const { menuItemId, dishId, drinkId, portionId, menuId, quantity = 1 } = options
    
    const orderItemData: any = {
      quantity: quantity
    }

    if (menuId) {
      orderItemData.menu_id = menuId
    } else if (menuItemId) {
      orderItemData.menu_item_id = menuItemId
      orderItemData.portion_id = portionId
    } else if (dishId) {
      orderItemData.dish_id = dishId
      orderItemData.portion_id = portionId
    } else if (drinkId) {
      orderItemData.drink_id = drinkId
      orderItemData.portion_id = portionId
    }

    return this.request<{
      order_item?: OrderMenuItem
      order_items?: OrderMenuItem[]
      order: {
        id: number
        code: string
        status: string
        total_price: number
      }
      message: string
      warnings?: string[]
    }>(`/establishments/${establishmentCode}/orders/${orderCode}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_item: orderItemData
      }),
    })
  }

  async removeItem(
    establishmentCode: string,
    orderCode: string,
    itemId: number
  ) {
    return this.request<{
      message: string
      order: { id: number; code: string; status: string; total_price: number }
    }>(
      `/establishments/${establishmentCode}/orders/${orderCode}/items/${itemId}`,
      { method: 'DELETE' }
    )
  }
}
