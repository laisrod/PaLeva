export interface Drink {
  id: number
  name: string
  description?: string
  calories?: number
  alcoholic?: boolean
}

export interface CreateDrinkFormData {
  name: string
  description: string
  alcoholic: boolean
  calories: string
  photo: File | null
}

export interface DrinkData {
  name: string
  description: string
  alcoholic: boolean
  calories?: number
  photo?: File
}

export interface UseCreateDrinkOptions {
  establishmentCode: string | undefined
  onSuccess?: () => void
}
