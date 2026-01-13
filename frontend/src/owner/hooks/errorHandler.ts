/**
 * Trata erros da API que podem vir como string ou array de strings
 */
export function formatApiError(error: string | string[] | undefined): string {
  if (!error) return ''
  
  if (Array.isArray(error)) {
    return error.join(', ')
  }
  
  return error
}

/**
 * Extrai mensagem de erro de uma resposta da API
 */
export function getErrorMessage(response: { error?: string | string[], errors?: string[] }): string {
  if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
    return formatApiError(response.errors)
  }
  
  if (response.error) {
    return formatApiError(response.error)
  }
  
  return ''
}
