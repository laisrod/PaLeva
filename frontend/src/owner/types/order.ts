export type OrderAction = 'confirm' | 'prepare' | 'ready' | 'deliver' | 'cancel'

export interface UseOrdersOptions {
  onMissingContactInfo?: (orderCode: string) => void
}

export interface UseCurrentOrderOptions {
  establishmentCode: string | undefined
  autoCreate?: boolean // Se true, cria pedido automaticamente quando não há pedido atual
}

export interface UseCreateOrderOptions {
  establishmentCode: string | undefined
  onSuccess?: (order: { id: number; code: string; status: string; total_price: number }) => void
}

export interface UseAddOrderItemOptions {
  establishmentCode: string | undefined
  orderCode: string | undefined
  onSuccess?: () => void
}

export interface AddOrderItemOptions {
  menuItemId?: number
  dishId?: number
  drinkId?: number
  portionId: number
  quantity?: number
}
