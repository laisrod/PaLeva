import { BaseApiService } from './base'
import { Drink, DrinkData } from '../types/drink'

export class DrinksApi extends BaseApiService {
  async getDrinks(establishmentCode: string, tagIds?: number[]) {
    let endpoint = `/establishments/${establishmentCode}/drinks`
    
    if (tagIds && tagIds.length > 0) {
      const params = new URLSearchParams()
      tagIds.forEach(id => params.append('tag_ids[]', id.toString()))
      endpoint += `?${params.toString()}`
    }
    
    return this.request<Drink[]>(endpoint)
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

    if (drinkData.tag_ids && drinkData.tag_ids.length > 0) {
      drinkData.tag_ids.forEach((tagId: number) => {
        formData.append('drink[tag_ids][]', tagId.toString())
      })
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

    if (drinkData.tag_ids && drinkData.tag_ids.length > 0) {
      drinkData.tag_ids.forEach((tagId: number) => {
        formData.append('drink[tag_ids][]', tagId.toString())
      })
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
