export interface Portion {
  id: number
  description: string
  price: number
  created_at?: string
  updated_at?: string
}

export interface CreatePortionFormData {
  description: string
  price: string
}

export interface PortionData {
  description: string
  price: number
}

export interface UseCreatePortionOptions {
  establishmentCode: string | undefined
  dishId: number | undefined
  onSuccess?: () => void
}

export interface UseEditPortionOptions {
  establishmentCode: string | undefined
  dishId: number | undefined
  portionId: number | undefined
  onSuccess?: () => void
}
