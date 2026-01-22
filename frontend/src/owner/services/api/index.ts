import { EstablishmentsApi } from './establishments'
import { MenusApi } from './menus'
import { TagsApi } from './tags'
import { DishesApi } from './dishes'
import { DrinksApi } from './drinks'
import { OrdersApi } from './orders'
import { WorkingHoursApi } from './workingHours'

class OwnerApiService {
  establishments: EstablishmentsApi
  menus: MenusApi
  tags: TagsApi
  dishes: DishesApi
  drinks: DrinksApi
  orders: OrdersApi
  workingHours: WorkingHoursApi

  constructor() {
    this.establishments = new EstablishmentsApi()
    this.menus = new MenusApi()
    this.tags = new TagsApi()
    this.dishes = new DishesApi()
    this.drinks = new DrinksApi()
    this.orders = new OrdersApi()
    this.workingHours = new WorkingHoursApi()
  }

  getEstablishment(code: string) {
    return this.establishments.getEstablishment(code)
  }

  createEstablishment(establishmentData: any) {
    return this.establishments.createEstablishment(establishmentData)
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

  getTags(establishmentCode: string) {
    return this.tags.getTags(establishmentCode)
  }

  createTag(establishmentCode: string, name: string) {
    return this.tags.createTag(establishmentCode, name)
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

  getDrinks(establishmentCode: string) {
    return this.drinks.getDrinks(establishmentCode)
  }

  createDrink(establishmentCode: string, drinkData: any) {
    return this.drinks.createDrink(establishmentCode, drinkData)
  }

  getOrders(establishmentCode: string) {
    return this.orders.getOrders(establishmentCode)
  }

  getOrder(establishmentCode: string, orderCode: string) {
    return this.orders.getOrder(establishmentCode, orderCode)
  }

  prepareOrder(establishmentCode: string, orderCode: string) {
    return this.orders.prepareOrder(establishmentCode, orderCode)
  }

  readyOrder(establishmentCode: string, orderCode: string) {
    return this.orders.readyOrder(establishmentCode, orderCode)
  }

  cancelOrder(establishmentCode: string, orderCode: string, reason?: string) {
    return this.orders.cancelOrder(establishmentCode, orderCode, reason)
  }

  getWorkingHours(establishmentCode: string) {
    return this.workingHours.getWorkingHours(establishmentCode)
  }

  updateWorkingHour(establishmentCode: string, workingHourId: number, workingHourData: any) {
    return this.workingHours.updateWorkingHour(establishmentCode, workingHourId, workingHourData)
  }
}

export const ownerApi = new OwnerApiService()
