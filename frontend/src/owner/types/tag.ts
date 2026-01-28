export type TagCategory = 'dish' | 'drink'

export interface Tag {
  id: number
  name: string
  category: TagCategory
}
