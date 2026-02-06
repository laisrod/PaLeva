import { OrderStatus } from '../types/orderHistory'

/**
 * Formata um valor numérico como moeda brasileira
 * @param value - Valor numérico
 * @returns String formatada como moeda (ex: "R$ 10,50")
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata uma data para o formato brasileiro
 * @param dateString - String de data (ISO format)
 * @returns String formatada (ex: "01/01/2024, 14:30")
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Retorna o label em português para um status de pedido
 * @param status - Status do pedido
 * @returns Label em português
 */
export function getStatusLabel(status: string): string {
  const statusMap: Record<OrderStatus | string, string> = {
    draft: 'Rascunho',
    pending: 'Pendente',
    preparing: 'Preparando',
    ready: 'Pronto',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  }
  return statusMap[status] || status
}

/**
 * Retorna a classe CSS para um status de pedido
 * @param status - Status do pedido
 * @returns Nome da classe CSS
 */
export function getStatusClass(status: string): string {
  const classMap: Record<OrderStatus | string, string> = {
    draft: 'status-draft',
    pending: 'status-pending',
    preparing: 'status-preparing',
    ready: 'status-ready',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled',
  }
  return classMap[status] || ''
}
