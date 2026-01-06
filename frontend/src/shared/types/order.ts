// Tipos TypeScript para Order
export interface Order {
  id: number
  code: string
  status: OrderStatus
  total_price: number
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  customer_cpf?: string
  cancellation_reason?: string
  created_at: string
  updated_at: string
  establishment_id: number
  order_menu_items?: OrderMenuItem[]
}

export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export interface OrderMenuItem {
  id: number
  quantity: number
  menu_item_id: number
  portion_id: number
  menu_item?: MenuItem
  portion?: Portion
}

export interface MenuItem {
  id: number
  name: string
  description?: string
}

export interface Portion {
  id: number
  name: string
  price: number
}

