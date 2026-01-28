import { Tag } from './tag'

export interface Dish {
  id: number
  name: string
  description?: string
  calories?: number
  photo_url?: string
  tags?: Tag[]
  min_price?: number
  max_price?: number
}

export interface CreateDishFormData {
  name: string
  description: string
  calories: string
  photo: File | null
  selectedTags: number[]
  newTagName: string
}

export interface DishData {
  name: string
  description: string
  calories?: number
  photo?: File
  tag_ids?: number[]
  tags_attributes?: Array<{ name: string }>
}

export interface UseCreateDishOptions {
  establishmentCode: string | undefined
  onSuccess?: () => void
}

export interface UseDishOptions {
  dishId: number | undefined
  establishmentCode: string | undefined
}

export interface UseDeleteDishOptions {
  establishmentCode: string | undefined
  onSuccess?: () => void
}

export interface DishesHeaderProps {
  establishmentCode: string
  isOwner: boolean
}

export interface DishesFiltersProps {
  tags: Tag[]
  selectedTags: number[]
  onToggleTag: (tagId: number) => void
}

export interface DishesEmptyProps {
  establishmentCode: string
  isOwner: boolean
}

export interface DishesListProps {
  dishes: Dish[]
  establishmentCode: string
  isOwner: boolean
  onDelete: (dishId: number) => Promise<boolean>
  deleting: boolean
}

export interface DishCardProps {
  dish: Dish
  establishmentCode: string
  isOwner: boolean
  onDelete?: (dishId: number) => Promise<boolean | void>
  deleting?: boolean
}
