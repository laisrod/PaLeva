import { BaseApiService } from './base'
import { EstablishmentData } from '../types/establishment'

export class EstablishmentsApi extends BaseApiService {
  async getEstablishment(code: string) {
    return this.request<{
      id: number
      name: string
      code: string
      city?: string
      state?: string
      phone_number?: string
    }>(`/establishments/${code}`)
  }

  async createEstablishment(establishmentData: EstablishmentData) {
    return this.request<{
      establishment: {
        id: number
        name: string
        code: string
        city?: string
        state?: string
      }
      message: string
    }>('/establishments', {
      method: 'POST',
      body: JSON.stringify({ establishment: establishmentData }),
    })
  }

  async updateEstablishment(code: string, establishmentData: Partial<EstablishmentData>) {
    return this.request<{
      establishment: {
        id: number
        name: string
        code: string
        city?: string
        state?: string
        phone_number?: string
        email?: string
        full_address?: string
      }
      message: string
    }>(`/establishments/${code}`, {
      method: 'PATCH',
      body: JSON.stringify({ establishment: establishmentData }),
    })
  }
}
