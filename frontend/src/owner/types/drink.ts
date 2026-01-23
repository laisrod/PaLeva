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
