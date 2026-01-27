import { BaseApiService } from './base'
import { Portion, PortionData } from '../../types/portion'

export class PortionsApi extends BaseApiService {
  async getPortions(establishmentCode: string, dishId: number) {
    return this.request<Portion[]>(`/establishments/${establishmentCode}/dishes/${dishId}/portions`)
  }

  async getPortion(establishmentCode: string, dishId: number, portionId: number) {
    return this.request<Portion>(`/establishments/${establishmentCode}/dishes/${dishId}/portions/${portionId}`)
  }

  async createPortion(establishmentCode: string, dishId: number, portionData: PortionData) {
    return this.request<{
      portion: Portion
      message: string
    }>(`/establishments/${establishmentCode}/dishes/${dishId}/portions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        portion: portionData
      }),
    })
  }

  async updatePortion(establishmentCode: string, dishId: number, portionId: number, portionData: PortionData) {
    return this.request<{
      portion: Portion
      message: string
    }>(`/establishments/${establishmentCode}/dishes/${dishId}/portions/${portionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        portion: portionData
      }),
    })
  }

  async deletePortion(establishmentCode: string, dishId: number, portionId: number) {
    return this.request<{ message: string }>(`/establishments/${establishmentCode}/dishes/${dishId}/portions/${portionId}`, {
      method: 'DELETE',
    })
  }
}
