export interface Tag {
  id: number
  name: string
}

export interface Drink {
  id: number
  name: string
  description?: string
  calories?: number
  alcoholic?: boolean
  photo_url?: string
  tags?: Tag[]
  min_price?: number
  max_price?: number
}

export interface CreateDrinkFormData {
  name: string
  description: string
  alcoholic: boolean
  calories: string
  photo: File | null
  selectedTags: number[]
  newTagName: string
}

export interface DrinkData {
  name: string
  description: string
  alcoholic: boolean
  calories?: number
  photo?: File
  tag_ids?: number[]
}

export interface UseCreateDrinkOptions {
  establishmentCode: string | undefined
  onSuccess?: () => void
}

export interface UseEditDrinkOptions {
  drinkId: number | undefined
  establishmentCode: string | undefined
  onSuccess?: () => void
}

export interface DrinkCardProps {
  drink: Drink
  establishmentCode: string
  isOwner: boolean
  onDelete?: (drinkId: number) => Promise<boolean | void>
  deleting?: boolean
}

export interface DrinksHeaderProps {
  establishmentCode: string
  isOwner: boolean
}

export interface DrinksFiltersProps {
  tags: Tag[]
  selectedTags: number[]
  onToggleTag: (tagId: number) => void
}

export interface DrinksEmptyProps {
  establishmentCode: string
  isOwner: boolean
}

export interface DrinksListProps {
  drinks: Drink[]
  establishmentCode: string
  isOwner: boolean
  onDelete: (drinkId: number) => Promise<boolean>
  deleting: boolean
}

export interface UseDrinkCardProps {
  drink: Drink
  establishmentCode: string
}
