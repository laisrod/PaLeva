export interface Establishment {
  id: number
  name: string
  phone_number?: string
  code: string
  city?: string
  state?: string
  full_address?: string
  email?: string
  working_hours?: Array<{
    id: number
    week_day: string
    open: boolean
    opening_hour?: string
    closing_hour?: string
  }>
}

export interface CreateEstablishmentFormData {
  name: string
  social_name: string
  cnpj: string
  full_address: string
  city: string
  state: string
  postal_code: string
  email: string
  phone_number: string
}

export interface EstablishmentData {
  name: string
  social_name: string
  cnpj: string
  full_address: string
  city: string
  state: string
  postal_code: string
  email: string
  phone_number: string
}

export interface UseCreateEstablishmentOptions {
  onSuccess?: () => void
}

export interface EditEstablishmentFormData {
  name: string
  phone_number: string
  email: string
  full_address: string
  city: string
  state: string
}
