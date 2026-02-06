export interface OrderStatusOption {
  value: string
  label: string
}

export const ORDER_STATUSES: OrderStatusOption[] = [
  { value: '', label: 'Todos os status' },
  { value: 'pending', label: 'Pendente' },
  { value: 'preparing', label: 'Preparando' },
  { value: 'ready', label: 'Pronto' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
]

export type OrderStatus = 'draft' | 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
