export type OrderType = 'delivery' | 'takeaway'

export interface CheckoutData {
  customer_name: string
  customer_email?: string
  customer_phone?: string
  items: Array<{
    menu_item_id?: number
    menu_id?: number
    portion_id?: number
    quantity: number
  }>
}
