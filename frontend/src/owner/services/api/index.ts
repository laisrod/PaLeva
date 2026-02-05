import { EstablishmentsApi } from './establishments'
import { MenusApi } from './menus'
import { TagsApi } from './tags'
import { DishesApi } from './dishes'
import { DrinksApi } from './drinks'
import { OrdersApi, invalidateOrderCache } from './Order/orders'
import { WorkingHoursApi } from './workingHours'
import { PortionsApi } from './portions'
import { OrderItemsApi } from './Order/orderItems'
import { DashboardApi } from './dashboard'
import { BaseApiService } from './base'
import { Portion } from '../../types/portion'

class OwnerApiService extends BaseApiService {
  establishments: EstablishmentsApi
  menus: MenusApi
  tags: TagsApi
  dishes: DishesApi
  drinks: DrinksApi
  orders: OrdersApi
  workingHours: WorkingHoursApi
  portions: PortionsApi
  orderItems: OrderItemsApi
  dashboard: DashboardApi

  constructor() {
    super()
    this.establishments = new EstablishmentsApi()
    this.menus = new MenusApi()
    this.tags = new TagsApi()
    this.dishes = new DishesApi()
    this.drinks = new DrinksApi()
    this.orders = new OrdersApi()
    this.workingHours = new WorkingHoursApi()
    this.portions = new PortionsApi()
    this.orderItems = new OrderItemsApi()
    this.dashboard = new DashboardApi()
  }

  getEstablishment(code: string) {
    return this.establishments.getEstablishment(code)
  }

  createEstablishment(establishmentData: any) {
    return this.establishments.createEstablishment(establishmentData)
  }

  updateEstablishment(code: string, establishmentData: any) {
    return this.establishments.updateEstablishment(code, establishmentData)
  }

  getMenus(establishmentCode: string) {
    return this.menus.getMenus(establishmentCode)
  }

  getMenu(establishmentCode: string, menuId: number) {
    return this.menus.getMenu(establishmentCode, menuId)
  }

  createMenu(establishmentCode: string, menuData: any) {
    return this.menus.createMenu(establishmentCode, menuData)
  }

  updateMenu(establishmentCode: string, menuId: number, menuData: any) {
    return this.menus.updateMenu(establishmentCode, menuId, menuData)
  }

  deleteMenu(establishmentCode: string, menuId: number) {
    return this.menus.deleteMenu(establishmentCode, menuId)
  }

  createMenuItem(establishmentCode: string, menuId: number, menuItemData: { dish_id?: number; drink_id?: number; portion_ids?: number[] }) {
    return this.menus.createMenuItem(establishmentCode, menuId, menuItemData)
  }

  updateMenuItem(establishmentCode: string, menuId: number, menuItemId: number, portionIds: number[]) {
    return this.menus.updateMenuItem(establishmentCode, menuId, menuItemId, portionIds)
  }

  deleteMenuItem(establishmentCode: string, menuId: number, menuItemId: number) {
    return this.menus.deleteMenuItem(establishmentCode, menuId, menuItemId)
  }

  getTags(establishmentCode: string, category?: 'dish' | 'drink') {
    return this.tags.getTags(establishmentCode, category)
  }

  getTag(establishmentCode: string, tagId: number) {
    return this.tags.getTag(establishmentCode, tagId)
  }

  createTag(establishmentCode: string, name: string, category: 'dish' | 'drink') {
    return this.tags.createTag(establishmentCode, name, category)
  }

  updateTag(establishmentCode: string, tagId: number, name: string) {
    return this.tags.updateTag(establishmentCode, tagId, name)
  }

  deleteTag(establishmentCode: string, tagId: number) {
    return this.tags.deleteTag(establishmentCode, tagId)
  }

  getDishes(establishmentCode: string, tagIds?: number[]) {
    return this.dishes.getDishes(establishmentCode, tagIds)
  }

  getDish(establishmentCode: string, dishId: number) {
    return this.dishes.getDish(establishmentCode, dishId)
  }

  createDish(establishmentCode: string, dishData: any) {
    return this.dishes.createDish(establishmentCode, dishData)
  }

  updateDish(establishmentCode: string, dishId: number, dishData: any) {
    return this.dishes.updateDish(establishmentCode, dishId, dishData)
  }

  deleteDish(establishmentCode: string, dishId: number) {
    return this.dishes.deleteDish(establishmentCode, dishId)
  }

  getPortions(establishmentCode: string, dishId: number) {
    return this.portions.getPortions(establishmentCode, dishId)
  }

  getPortion(establishmentCode: string, dishId: number, portionId: number) {
    return this.portions.getPortion(establishmentCode, dishId, portionId)
  }

  createPortion(establishmentCode: string, dishId: number, portionData: any) {
    return this.portions.createPortion(establishmentCode, dishId, portionData)
  }

  updatePortion(establishmentCode: string, dishId: number, portionId: number, portionData: any) {
    return this.portions.updatePortion(establishmentCode, dishId, portionId, portionData)
  }

  deletePortion(establishmentCode: string, dishId: number, portionId: number) {
    return this.portions.deletePortion(establishmentCode, dishId, portionId)
  }

  getDrinks(establishmentCode: string, tagIds?: number[]) {
    return this.drinks.getDrinks(establishmentCode, tagIds)
  }

  getDrink(establishmentCode: string, drinkId: number) {
    return this.drinks.getDrink(establishmentCode, drinkId)
  }

  createDrink(establishmentCode: string, drinkData: any) {
    return this.drinks.createDrink(establishmentCode, drinkData)
  }

  updateDrink(establishmentCode: string, drinkId: number, drinkData: any) {
    return this.drinks.updateDrink(establishmentCode, drinkId, drinkData)
  }

  deleteDrink(establishmentCode: string, drinkId: number) {
    return this.drinks.deleteDrink(establishmentCode, drinkId)
  }

  getDrinkPortions(establishmentCode: string, drinkId: number) {
    return this.request<Portion[]>(`/establishments/${establishmentCode}/drinks/${drinkId}/portions`)
  }

  getDrinkPortion(establishmentCode: string, drinkId: number, portionId: number) {
    return this.request<Portion>(`/establishments/${establishmentCode}/drinks/${drinkId}/portions/${portionId}`)
  }

  createDrinkPortion(establishmentCode: string, drinkId: number, portionData: any) {
    return this.request<{
      portion: Portion
      message: string
    }>(`/establishments/${establishmentCode}/drinks/${drinkId}/portions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        portion: portionData
      }),
    })
  }

  updateDrinkPortion(establishmentCode: string, drinkId: number, portionId: number, portionData: any) {
    return this.request<{
      portion: Portion
      message: string
    }>(`/establishments/${establishmentCode}/drinks/${drinkId}/portions/${portionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        portion: portionData
      }),
    })
  }

  deleteDrinkPortion(establishmentCode: string, drinkId: number, portionId: number) {
    return this.request<{ message: string }>(`/establishments/${establishmentCode}/drinks/${drinkId}/portions/${portionId}`, {
      method: 'DELETE',
    })
  }

  getOrders(establishmentCode: string) {
    return this.orders.getOrders(establishmentCode)
  }

  createOrder(establishmentCode: string, orderData?: { customer_name?: string }) {
    return this.orders.createOrder(establishmentCode, orderData)
  }

  addOrderItem(
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
    return this.orderItems.addItem(establishmentCode, orderCode, options)
  }

  removeOrderItem(
    establishmentCode: string,
    orderCode: string,
    itemId: number
  ) {
    return this.orderItems.removeItem(establishmentCode, orderCode, itemId)
  }

  getOrder(establishmentCode: string, orderCode: string) {
    return this.orders.getOrder(establishmentCode, orderCode)
  }

  invalidateOrderCache(establishmentCode: string, orderCode: string) {
    invalidateOrderCache(establishmentCode, orderCode)
  }

  updateOrder(
    establishmentCode: string,
    orderCode: string,
    orderData: {
      customer_name?: string
      customer_email?: string
      customer_phone?: string
      customer_cpf?: string
    }
  ) {
    return this.orders.updateOrder(establishmentCode, orderCode, orderData)
  }

  confirmOrder(establishmentCode: string, orderCode: string) {
    return this.orders.confirmOrder(establishmentCode, orderCode)
  }

  prepareOrder(establishmentCode: string, orderCode: string) {
    return this.orders.prepareOrder(establishmentCode, orderCode)
  }

  readyOrder(establishmentCode: string, orderCode: string) {
    return this.orders.readyOrder(establishmentCode, orderCode)
  }

  deliverOrder(establishmentCode: string, orderCode: string) {
    return this.orders.deliverOrder(establishmentCode, orderCode)
  }

  cancelOrder(establishmentCode: string, orderCode: string, reason?: string) {
    return this.orders.cancelOrder(establishmentCode, orderCode, reason)
  }

  deleteOrder(establishmentCode: string, orderCode: string) {
    return this.orders.deleteOrder(establishmentCode, orderCode)
  }

  getWorkingHours(establishmentCode: string) {
    return this.workingHours.getWorkingHours(establishmentCode)
  }

  updateWorkingHour(establishmentCode: string, workingHourId: number, workingHourData: any) {
    return this.workingHours.updateWorkingHour(establishmentCode, workingHourId, workingHourData)
  }

  getDashboardStats(establishmentCode: string, period: 'day' | 'month' | 'year' = 'day') {
    return this.dashboard.getStats(establishmentCode, period)
  }

  getRatings(establishmentCode: string) {
    return this.request<{
      order_reviews: Array<{
        id: number
        type: string
        rating: number
        comment?: string
        created_at: string
        user: { id: number; name: string; email: string }
        order: { id: number; code: string; total_price: number; status: string }
      }>
      dish_ratings: Array<{
        id: number
        type: string
        rating: number
        comment?: string
        created_at: string
        user: { id: number; name: string; email: string }
        item: { id: number; name: string; type: string }
      }>
      drink_ratings: Array<{
        id: number
        type: string
        rating: number
        comment?: string
        created_at: string
        user: { id: number; name: string; email: string }
        item: { id: number; name: string; type: string }
      }>
      statistics: {
        total_order_reviews: number
        total_dish_ratings: number
        total_drink_ratings: number
        average_order_rating: number
        average_dish_rating: number
        average_drink_rating: number
        overall_average: number
      }
    }>(`/establishments/${establishmentCode}/ratings`)
  }
}

export const ownerApi = new OwnerApiService()
