import { BaseApiService } from './base'
import { Drink, DrinkData } from '../types/drink'

export class DrinksApi extends BaseApiService {
  async getDrinks(establishmentCode: string) {
    return this.request<Drink[]>(`/establishments/${establishmentCode}/drinks`)
  }

  async createDrink(establishmentCode: string, drinkData: DrinkData) {
    const formData = new FormData()
    formData.append('drink[name]', drinkData.name)
    formData.append('drink[description]', drinkData.description)
    
    if (drinkData.alcoholic !== undefined) {
      formData.append('drink[alcoholic]', drinkData.alcoholic ? '1' : '0')
    }
    
    if (drinkData.calories !== undefined) {
      formData.append('drink[calories]', drinkData.calories.toString())
    }
    
    if (drinkData.photo) {
      formData.append('drink[photo]', drinkData.photo)
    }

    return this.requestFormData<{
      drink: Drink
      message: string
    }>(`/establishments/${establishmentCode}/drinks`, formData)
  }

  async getDrink(establishmentCode: string, drinkId: number) {
    return this.request<Drink>(`/establishments/${establishmentCode}/drinks/${drinkId}`)
  }

  async updateDrink(establishmentCode: string, drinkId: number, drinkData: DrinkData) {
    const formData = new FormData()
    formData.append('drink[name]', drinkData.name)
    formData.append('drink[description]', drinkData.description)
    
    if (drinkData.alcoholic !== undefined) {
      formData.append('drink[alcoholic]', drinkData.alcoholic ? '1' : '0')
    }
    
    if (drinkData.calories !== undefined) {
      formData.append('drink[calories]', drinkData.calories.toString())
    }
    
    if (drinkData.photo) {
      formData.append('drink[photo]', drinkData.photo)
    }

    return this.requestFormData<{
      drink: Drink
      message: string
    }>(`/establishments/${establishmentCode}/drinks/${drinkId}`, formData, {
      method: 'PATCH',
    })
  }

  async deleteDrink(establishmentCode: string, drinkId: number) {
    return this.request<{ message: string }>(`/establishments/${establishmentCode}/drinks/${drinkId}`, {
      method: 'DELETE',
    })
  }
}
