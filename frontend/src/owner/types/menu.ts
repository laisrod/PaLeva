export interface Menu {
  id: number
  name: string
  description: string
  price?: number
}

export interface MenuResponse {
  id: number
  name: string
  description: string
  price?: number
  menu_items?: MenuItemWithPortions[]
}

export interface MenuItemWithPortions {
  id: number
  dish: {
    id: number
    name: string
    description: string
    portions: Array<{
      id: number
      description: string
      price: number
    }>
  } | null
  drink: {
    id: number
    name: string
    description: string
    portions: Array<{
      id: number
      description: string
      price: number
    }>
  } | null
}

export interface MenuItem {
  id: number
  menu_item_id: number
  name: string
  description: string
  price: number
  category: string
  portions: Array<{
    id: number
    name: string
    price: number
  }>
  image?: string
}

export interface CreateMenuFormData {
  name: string
  description: string
}

export interface EditMenuFormData {
  name: string
  description: string
  price: string
}

export interface MenuData {
  name: string
  description: string
  price?: number
}

export interface UseCreateMenuOptions {
  establishmentCode: string | undefined
  onSuccess?: () => void
}

export interface UseEditMenuOptions {
  menuId: number | undefined
  establishmentCode: string | undefined
  onSuccess?: () => void
}

export interface UseMenuOptions {
  menuId: number | undefined
  establishmentCode: string | undefined
}
