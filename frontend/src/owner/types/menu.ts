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
    photo_url?: string
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
    photo_url?: string
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

export interface UseMenuItemsOptions {
  menuId: number | undefined
  establishmentCode: string | undefined
}

export interface MenuItemsListProps {
  menuItems: MenuItemWithPortions[]
  onSelectItem: (menuItemId: number, portionId: number, quantity: number) => void
  loading?: boolean
}

export interface AddMenuItemsProps {
  establishmentCode: string
  menuId: number
  onItemAdded: () => void
  existingItems: Array<{ dish?: { id: number } | null; drink?: { id: number } | null }>
}

export interface ManagingPortions {
  menuItemId: number
  productId: number
  isDish: boolean
  productName: string
}

export interface ManageMenuItemPortionsProps {
  establishmentCode: string
  menuId: number
  menuItemId: number
  productId: number
  isDish: boolean
  productName: string
  onClose: () => void
  onSuccess: () => void
}
