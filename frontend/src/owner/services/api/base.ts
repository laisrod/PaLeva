import { firebaseAuth } from '../../../shared/services/firebaseAuth'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

export interface ApiResponse<T> {
  data?: T
  error?: string | string[]
  errors?: string[]
  message?: string
}

export class BaseApiService {
  /**
   * Obtém o token de autenticação do Firebase
   */
  protected async getAuthToken(): Promise<string | null> {
    return await firebaseAuth.getIdToken()
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const url = `${API_BASE_URL}${endpoint}`
    console.log('API Request:', url, { method: options.method || 'GET', headers })

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      })
      
      console.log('API Response:', url, response.status, response.statusText)

      const contentType = response.headers.get('content-type')
      let data: any = {}

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text()
        console.log('API Response Body (texto):', text.substring(0, 500))
        try {
          data = text ? JSON.parse(text) : {}
          console.log('API Response Body (parseado):', data)
        } catch (parseError) {
          console.error('Erro ao fazer parse do JSON:', parseError, 'Texto:', text.substring(0, 200))
          return {
            error: 'Resposta inválida do servidor',
            message: 'O servidor retornou uma resposta que não pôde ser processada. Verifique se o servidor está rodando.',
          }
        }
      } else {
        const text = await response.text()
        console.log('API Response não é JSON:', text.substring(0, 200))
        
        if (!text || text.trim() === '') {
          return {
            error: 'Servidor não está respondendo',
            message: 'O servidor Rails pode não estar rodando. Verifique se o servidor está ativo.',
          }
        }
        
        return {
          error: 'Erro no servidor',
          message: `O servidor retornou um erro (${response.status}). Resposta: ${text.substring(0, 200)}`,
        }
      }

      if (!response.ok) {
        console.error('API Response não OK:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        })
        return {
          error: Array.isArray(data.error) ? data.error.join(', ') : (data.error || 'Erro na requisição'),
          errors: data.errors,
          message: data.message,
        }
      }

      console.log('API Response OK, data:', data)
      return { data }
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return {
          error: 'Servidor não está acessível',
          message: 'Não foi possível conectar ao servidor Rails. Verifique se o servidor está rodando na porta 3000.',
        }
      }
      
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        message: 'Não foi possível conectar ao servidor. Verifique se o servidor está rodando.',
      }
    }
  }

  protected async requestFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken()
    const headers: HeadersInit = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const url = `${API_BASE_URL}${endpoint}`
    console.log('Enviando FormData para:', url)
    console.log('Headers:', headers)
    
    // Log do conteúdo do FormData (apenas chaves, não valores sensíveis)
    console.log('FormData keys:', Array.from(formData.keys()))

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
      })
      
      console.log('Status da resposta:', response.status, response.statusText)

      const contentType = response.headers.get('content-type')
      let data: any = {}

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text()
        console.log('Resposta JSON (texto):', text)
        try {
          data = text ? JSON.parse(text) : {}
          console.log('Resposta JSON (parseado):', data)
        } catch (parseError) {
          console.error('Erro ao fazer parse do JSON:', parseError)
          return {
            error: 'Resposta inválida do servidor',
            message: 'O servidor retornou uma resposta que não pôde ser processada.',
          }
        }
      } else {
        const text = await response.text()
        console.log('Resposta não é JSON:', text)
        if (!text || text.trim() === '') {
          return {
            error: 'Servidor não está respondendo',
            message: 'O servidor Rails pode não estar rodando. Verifique se o servidor está ativo.',
          }
        }
        return {
          error: 'Erro no servidor',
          message: `O servidor retornou um erro (${response.status}). Resposta: ${text.substring(0, 200)}`,
        }
      }

      if (!response.ok) {
        console.error('Resposta não OK:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        })
        return {
          error: Array.isArray(data.error) ? data.error.join(', ') : (data.error || 'Erro na requisição'),
          errors: data.errors,
          message: data.message,
        }
      }

      console.log('Resposta OK, retornando data:', data)
      return { data }
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return {
          error: 'Servidor não está acessível',
          message: 'Não foi possível conectar ao servidor Rails. Verifique se o servidor está rodando na porta 3000.',
        }
      }
      
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        message: 'Erro ao fazer requisição. Verifique se o servidor está rodando.',
      }
    }
  }
}
