import { CartItem } from '../types/cart'

/**
 * Calcula o total de itens no carrinho
 * @param cart - Array de itens do carrinho
 * @returns Total de itens (soma das quantidades)
 */
export function calculateItemCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}

/**
 * Formata o texto de contagem de itens
 * @param count - Número de itens
 * @returns String formatada (ex: "1 item" ou "2 itens")
 */
export function formatItemCount(count: number): string {
  return count === 1 ? 'item' : 'itens'
}
