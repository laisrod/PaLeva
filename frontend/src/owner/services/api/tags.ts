import { BaseApiService } from './base'
import { Tag } from '../types/tag'

export class TagsApi extends BaseApiService {
  async getTags(establishmentCode: string) {
    return this.request<Tag[]>(`/establishments/${establishmentCode}/tags`)
  }

  async createTag(establishmentCode: string, name: string) {
    return this.request<{
      tag: Tag
      message: string
    }>(`/establishments/${establishmentCode}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag: { name } }),
    })
  }
}
