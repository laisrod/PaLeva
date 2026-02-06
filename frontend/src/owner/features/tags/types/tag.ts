export type TagCategory = 'dish' | 'drink'

export interface Tag {
  id: number
  name: string
  category: TagCategory
}


export function getCategoryFromSearchParams(searchParams: URLSearchParams): TagCategory {
  const categoryParam = searchParams.get('category') as TagCategory | null
  return categoryParam === 'drink' ? 'drink' : 'dish'
}

export function getTagCategoryTitle(category: TagCategory): string {
  return category === 'drink'
    ? 'Nova característica de Bebida'
    : 'Nova característica de Prato'
}
