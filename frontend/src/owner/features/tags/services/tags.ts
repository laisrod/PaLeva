import { BaseApiService } from '../../../shared/services/api/base'
import { Tag, TagCategory } from '../../../tags/types/tag'

export class TagsApi extends BaseApiService {
  async getTags(establishmentCode: string, category?: TagCategory) {
    const url = category
      ? `/establishments/${establishmentCode}/tags?category=${category}`
      : `/establishments/${establishmentCode}/tags`
    return this.request<Tag[]>(url)
  }

  async getTag(establishmentCode: string, tagId: number) {
    return this.request<Tag>(`/establishments/${establishmentCode}/tags/${tagId}`)
  }

  async createTag(establishmentCode: string, name: string, category: TagCategory) {
    return this.request<{
      tag: Tag
      message: string
    }>(`/establishments/${establishmentCode}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag: { name, category } }),
    })
  }

  async updateTag(establishmentCode: string, tagId: number, name: string) {
    return this.request<{
      tag: Tag
      message: string
    }>(`/establishments/${establishmentCode}/tags/${tagId}`, {
      method: 'PATCH',
      body: JSON.stringify({ tag: { name } }),
    })
  }

  async deleteTag(establishmentCode: string, tagId: number) {
    return this.request<{ message: string }>(
      `/establishments/${establishmentCode}/tags/${tagId}`,
      { method: 'DELETE' }
    )
  }
}
