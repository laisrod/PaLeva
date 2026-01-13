import { BaseApiService } from './base'
import { Dish, DishData } from '../types/dish'

export class DishesApi extends BaseApiService {
  async getDishes(establishmentCode: string, tagIds?: number[]) {
    let endpoint = `/establishments/${establishmentCode}/dishes`
    
    if (tagIds && tagIds.length > 0) {
      const params = new URLSearchParams()
      tagIds.forEach(id => params.append('tag_ids[]', id.toString()))
      endpoint += `?${params.toString()}`
    }

    return this.request<Dish[]>(endpoint)
  }

  async createDish(establishmentCode: string, dishData: DishData) {
    const formData = new FormData()
    formData.append('dish[name]', dishData.name)
    formData.append('dish[description]', dishData.description)
    
    if (dishData.calories !== undefined) {
      formData.append('dish[calories]', dishData.calories.toString())
    }
    
    if (dishData.photo) {
      formData.append('dish[photo]', dishData.photo)
    }
    
    if (dishData.tag_ids && dishData.tag_ids.length > 0) {
      dishData.tag_ids.forEach((tagId) => {
        formData.append('dish[tag_ids][]', tagId.toString())
      })
    }
    
    if (dishData.tags_attributes && dishData.tags_attributes.length > 0) {
      dishData.tags_attributes.forEach((tag, index) => {
        formData.append(`dish[tags_attributes][${index}][name]`, tag.name)
      })
    }

    return this.requestFormData<{
      dish: Dish
      message: string
    }>(`/establishments/${establishmentCode}/dishes`, formData)
  }
}
