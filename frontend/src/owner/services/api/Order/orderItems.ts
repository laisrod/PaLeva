import { BaseApiService } from '../base'
import { OrderMenuItem } from '../../shared/types/order'

export class OrderItemsApi extends BaseApiService {
  async addItem(
    establishmentCode: string,
    orderCode: string,
    options: {
      menuItemId?: number
      dishId?: number
      drinkId?: number
      portionId: number
      quantity?: number
    }
  ) {
    const { menuItemId, dishId, drinkId, portionId, quantity = 1 } = options
    
    const orderItemData: any = {
      portion_id: portionId,
      quantity: quantity
    }

    if (menuItemId) {
      orderItemData.menu_item_id = menuItemId
    } else if (dishId) {
      orderItemData.dish_id = dishId
    } else if (drinkId) {
      orderItemData.drink_id = drinkId
    }

    return this.request<{
      order_item: OrderMenuItem
      order: {
        id: number
        code: string
        status: string
        total_price: number
      }
      message: string
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
}
