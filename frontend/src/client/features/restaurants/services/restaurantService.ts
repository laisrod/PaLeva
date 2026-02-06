import { api } from '../../../../shared/services/api'
import { Restaurant } from '../types/restaurant'

/**
 * Busca lista de estabelecimentos/restaurantes
 * @returns Promise com lista de restaurantes
 */
export async function getRestaurants(): Promise<Restaurant[]> {
  const response = await api.getEstablishments()
  
  if (response.error) {
    throw new Error(Array.isArray(response.error) ? response.error.join(', ') : response.error)
  }

  if (response.data) {
    // Se response.data é um array, retorna diretamente
    if (Array.isArray(response.data)) {
      return response.data as Restaurant[]
    }
    
    // Se response.data é um objeto com propriedade establishments
    if (typeof response.data === 'object' && 'establishments' in response.data) {
      return (response.data as { establishments: Restaurant[] }).establishments
    }
    
    // Se response.data é um objeto único, retorna como array
    return [response.data as Restaurant]
  }

  return []
}
