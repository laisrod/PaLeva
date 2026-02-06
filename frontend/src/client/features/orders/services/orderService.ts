import { api } from '../../../../shared/services/api'
import { CheckoutData } from '../types/menuPage'

/**
 * Cria um pedido público (sem autenticação)
 * @param establishmentCode - Código do estabelecimento
 * @param checkoutData - Dados do checkout
 * @returns Promise com a resposta da API
 */
export async function createPublicOrder(
  establishmentCode: string,
  checkoutData: CheckoutData
) {
  return api.createPublicOrder(establishmentCode, checkoutData)
}
