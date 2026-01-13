const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

export interface ApiResponse<T> {
  data?: T
  error?: string | string[]
  errors?: string[]
  message?: string
}

export class BaseApiService {
  protected getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      })

      const contentType = response.headers.get('content-type')
      let data: any = {}

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text()
        try {
          data = text ? JSON.parse(text) : {}
        } catch (parseError) {
          return {
            error: 'Resposta inválida do servidor',
            message: 'O servidor retornou uma resposta que não pôde ser processada. Verifique se o servidor está rodando.',
          }
        }
      } else {
        const text = await response.text()
        
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
        return {
          error: Array.isArray(data.error) ? data.error.join(', ') : (data.error || 'Erro na requisição'),
          errors: data.errors,
          message: data.message,
        }
      }

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
    const token = this.getAuthToken()
    const headers: HeadersInit = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || 'Erro na requisição',
          errors: data.errors,
          message: data.message,
        }
      }

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
