// Serviço de API para comunicação com backend Rails
import { firebaseAuth } from './firebaseAuth'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

interface ApiResponse<T> {
  data?: T
  error?: string | string[]
  errors?: string[]
  message?: string
}

class ApiService {
  /**
   * Obtém o token de autenticação do Firebase
   */
  private async getAuthToken(): Promise<string | null> {
    return await firebaseAuth.getIdToken()
  }

  private async request<T>(
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

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      })

      // Verificar se a resposta é JSON antes de tentar fazer parse
      const contentType = response.headers.get('content-type')
      let data: any = {}

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text()
        try {
          data = text ? JSON.parse(text) : {}
        } catch (parseError) {
          // Erro "Unexpected end of JSON input" ocorre aqui
          // Geralmente significa que o servidor retornou resposta vazia ou incompleta
          return {
            error: 'Resposta inválida do servidor',
            message: 'O servidor retornou uma resposta que não pôde ser processada. Verifique se o servidor está rodando.',
          }
        }
      } else {
        // Se não for JSON, tentar ler como texto
        const text = await response.text()
        
        // Se a resposta estiver vazia, pode ser que o servidor não esteja rodando
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
      // Erro de rede (servidor não acessível)
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        message: 'Não foi possível conectar ao servidor. Verifique se o servidor está rodando.',
      }
    }
  }

  // Autenticação - agora usando Firebase
  // Os métodos signIn e signOut foram movidos para firebaseAuth.ts
  // Este método verifica se o usuário está autenticado usando o token do Firebase
  async isSignedIn(firebaseToken?: string) {
    const token = firebaseToken || await this.getAuthToken()
    
    if (!token) {
      console.warn('isSignedIn: Token não disponível')
      return { data: { signed_in: false } }
    }

    console.log('isSignedIn: Fazendo requisição para /is_signed_in')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }

    try {
      const url = `${API_BASE_URL}/is_signed_in`
      console.log('isSignedIn: URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      })

      console.log('isSignedIn: Status:', response.status, response.statusText)
      const contentType = response.headers.get('content-type')
      let data: any = {}

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text()
        console.log('isSignedIn: Resposta (texto):', text.substring(0, 200))
        try {
          data = text ? JSON.parse(text) : {}
          console.log('isSignedIn: Resposta (parseada):', data)
        } catch (parseError) {
          console.error('isSignedIn: Erro ao fazer parse:', parseError)
          return {
            error: 'Resposta inválida do servidor',
            message: 'O servidor retornou uma resposta que não pôde ser processada.',
          }
        }
      } else {
        const text = await response.text()
        console.warn('isSignedIn: Resposta não é JSON:', text.substring(0, 200))
      }

      if (!response.ok) {
        console.error('isSignedIn: Resposta não OK:', response.status, data)
        return {
          error: Array.isArray(data.error) ? data.error.join(', ') : (data.error || 'Erro na requisição'),
          errors: data.errors,
          message: data.message,
        }
      }

      console.log('isSignedIn: Sucesso!', data)
      return { data }
    } catch (error) {
      console.error('isSignedIn: Erro na requisição:', error)
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        message: 'Não foi possível conectar ao servidor.',
      }
    }
  }

  // Define cookie com token Firebase para requisições HTML
  async setCookie(firebaseToken?: string) {
    const token = firebaseToken || await this.getAuthToken()
    
    if (!token) {
      return { error: 'Token não disponível' }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }

    try {
      const response = await fetch(`${API_BASE_URL}/set_cookie`, {
        method: 'POST',
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
            message: 'O servidor retornou uma resposta que não pôde ser processada.',
          }
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
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        message: 'Não foi possível conectar ao servidor.',
      }
    }
  }

  // Limpa cookie de autenticação
  async clearCookie() {
    try {
      const response = await fetch(`${API_BASE_URL}/sign_out`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      // Não importa se falhar, apenas tentar limpar
      return { success: true }
    } catch (error) {
      // Ignorar erros ao limpar cookie
      return { success: false }
    }
  }

  async signUp(userData: {
    name: string
    last_name: string
    email: string
    cpf: string
    password: string
    password_confirmation: string
  }) {
    try {
      // Obter token do Firebase para autenticar a requisição
      const token = await this.getAuthToken()
      
      if (!token) {
        console.error('Token do Firebase não disponível')
        return {
          error: 'Token do Firebase não disponível. Tente fazer login após criar a conta.',
        }
      }
      
      console.log('Enviando requisição com token:', token.substring(0, 20) + '...')
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }

      console.log('Fazendo fetch para:', `${API_BASE_URL}/users`)
      console.log('Dados enviados:', { user: userData })
      
      // Criar um AbortController para timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos
      
      let response
      try {
        response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ user: userData }),
          signal: controller.signal,
      })
        clearTimeout(timeoutId)
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          console.error('Requisição timeout após 30 segundos')
          return {
            error: 'Timeout na requisição',
            message: 'O servidor demorou muito para responder. Verifique se o servidor Rails está rodando na porta 3000.',
          }
        }
        throw fetchError
      }

      console.log('Resposta recebida - Status:', response.status, response.statusText)
      console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()))

      // Verificar se a resposta é JSON antes de tentar fazer parse
      const contentType = response.headers.get('content-type')
      let data

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text()
        try {
          data = text ? JSON.parse(text) : {}
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError)
          console.error('Response text:', text)
          return {
            error: 'Resposta inválida do servidor',
            message: 'O servidor retornou uma resposta que não pôde ser processada',
          }
        }
      } else {
        // Se não for JSON, tentar ler como texto
        const text = await response.text()
        console.error('Non-JSON response:', text)
        console.error('Response status:', response.status)
        console.error('Response headers:', Object.fromEntries(response.headers.entries()))
        console.error('Request URL:', `${API_BASE_URL}/users`)
        
        // Se a resposta estiver vazia, pode ser que o servidor não esteja rodando
        if (!text || text.trim() === '') {
          return {
            error: 'Servidor não está respondendo',
            message: 'O servidor Rails pode não estar rodando. Verifique se o servidor está ativo na porta 3000.',
          }
        }
        
        return {
          error: 'Erro no servidor',
          message: `O servidor retornou um erro (${response.status}). Resposta: ${text.substring(0, 200)}`,
        }
      }

      if (!response.ok) {
        console.error('Erro na resposta do servidor:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        })
        
        const errorMessage = Array.isArray(data.error) 
          ? data.error.join(', ') 
          : (data.error || `Erro ao criar conta (${response.status})`)
        
        return {
          error: errorMessage,
          message: data.message,
        }
      }

      return { data }
    } catch (error) {
      console.error('Network error:', error)
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        message: 'Não foi possível conectar ao servidor. Verifique se o servidor está rodando.',
      }
    }
  }


  // Establishments (public for clients)
  async getEstablishments() {
    return this.request<
      Array<{
        id: number
        name: string
        code: string
        city?: string
        state?: string
      }>
    >('/establishments')
  }

  async getEstablishment(code: string) {
    return this.request<{
      id: number
      name: string
      code: string
      city?: string
      state?: string
    }>(`/establishments/${code}`)
  }

  async createEstablishment(establishmentData: {
    name: string
    social_name: string
    cnpj: string
    full_address: string
    city: string
    state: string
    postal_code: string
    email: string
    phone_number: string
  }) {
    return this.request<{
      establishment: {
        id: number
        name: string
        code: string
        city?: string
        state?: string
      }
      message: string
    }>('/establishments', {
      method: 'POST',
      body: JSON.stringify({ establishment: establishmentData }),
    })
  }

  // Menus
  async getMenus(establishmentCode: string) {
    return this.request<
      Array<{
        id: number
        name: string
        description: string
      }>
    >(`/establishments/${establishmentCode}/menus`)
  }

  async getMenu(menuId: number) {
    return this.request<{
      id: number
      name: string
      description: string
    }>(`/menus/${menuId}`)
  }

  async createMenu(establishmentCode: string, menuData: {
    name: string
    description: string
  }) {
    return this.request<{
      menu: {
        id: number
        name: string
        description: string
      }
      message: string
    }>(`/establishments/${establishmentCode}/menus`, {
      method: 'POST',
      body: JSON.stringify({ menu: menuData }),
    })
  }

  async updateMenu(menuId: number, menuData: {
    name: string
    description: string
  }) {
    return this.request<{
      menu: {
        id: number
        name: string
        description: string
      }
      message: string
    }>(`/menus/${menuId}`, {
      method: 'PATCH',
      body: JSON.stringify({ menu: menuData }),
    })
  }

  async deleteMenu(menuId: number) {
    return this.request<{ message: string }>(`/menus/${menuId}`, {
      method: 'DELETE',
    })
  }

  // Tags
  async getTags(establishmentCode: string) {
    return this.request<
      Array<{
        id: number
        name: string
      }>
    >(`/establishments/${establishmentCode}/tags`)
  }

  async createTag(establishmentCode: string, name: string) {
    return this.request<{
      tag: {
        id: number
        name: string
      }
      message: string
    }>(`/establishments/${establishmentCode}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag: { name } }),
    })
  }

  // Dishes
  async getDishes(establishmentCode: string, tagIds?: number[]) {
    let endpoint = `/establishments/${establishmentCode}/dishes`
    
    if (tagIds && tagIds.length > 0) {
      const params = new URLSearchParams()
      tagIds.forEach(id => params.append('tag_ids[]', id.toString()))
      endpoint += `?${params.toString()}`
    }

    return this.request<
      Array<{
        id: number
        name: string
        description?: string
        calories?: number
        tags?: Array<{
          id: number
          name: string
        }>
      }>
    >(endpoint)
  }

  // Drinks
async getDrinks(establishmentCode: string) {
  return this.request<
    Array<{
      id: number
      name: string
      description?: string
      calories?: number
      alcoholic?: boolean
    }>
  >(`/establishments/${establishmentCode}/drinks`)
}

  async createDish(establishmentCode: string, dishData: {
    name: string
    description: string
    calories?: number
    photo?: File
    tag_ids?: number[]
    tags_attributes?: Array<{ name: string }>
  }) {
    const formData = new FormData()
    formData.append('dish[name]', dishData.name)
    formData.append('dish[description]', dishData.description)
    
    if (dishData.calories !== undefined) {
      formData.append('dish[calories]', dishData.calories.toString())
    }
    
    if (dishData.photo) {
      formData.append('dish[photo]', dishData.photo)
    }
    
    if (dishData.tag_ids && dishData.tag_ids.length > 0) {
      dishData.tag_ids.forEach((tagId) => {
        formData.append('dish[tag_ids][]', tagId.toString())
      })
    }
    
    if (dishData.tags_attributes && dishData.tags_attributes.length > 0) {
      dishData.tags_attributes.forEach((tag, index) => {
        formData.append(`dish[tags_attributes][${index}][name]`, tag.name)
      })
    }

    const token = await this.getAuthToken()
    const headers: HeadersInit = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${API_BASE_URL}/establishments/${establishmentCode}/dishes`, {
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
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  // Drinks
  async createDrink(establishmentCode: string, drinkData: {
    name: string
    description: string
    alcoholic?: boolean
    calories?: number
    photo?: File
  }) {
    const formData = new FormData()
    formData.append('drink[name]', drinkData.name)
    formData.append('drink[description]', drinkData.description)
    
    if (drinkData.alcoholic !== undefined) {
      formData.append('drink[alcoholic]', drinkData.alcoholic ? '1' : '0')
    }
    
    if (drinkData.calories !== undefined) {
      formData.append('drink[calories]', drinkData.calories.toString())
    }
    
    if (drinkData.photo) {
      formData.append('drink[photo]', drinkData.photo)
    }

    const token = await this.getAuthToken()
    const headers: HeadersInit = {}
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${API_BASE_URL}/establishments/${establishmentCode}/drinks`, {
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
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  // Orders
  async getOrders(establishmentCode: string) {
    return this.request<any[]>(
      `/establishments/${establishmentCode}/orders`
    )
  }

  async getOrder(establishmentCode: string, orderCode: string) {
    return this.request<any>(
      `/establishments/${establishmentCode}/orders/${orderCode}`
    )
  }

  async prepareOrder(establishmentCode: string, orderCode: string) {
    return this.request<any>(
      `/establishments/${establishmentCode}/orders/${orderCode}/prepare_order`,
      { method: 'PATCH' }
    )
  }

  async readyOrder(establishmentCode: string, orderCode: string) {
    return this.request<any>(
      `/establishments/${establishmentCode}/orders/${orderCode}/ready_order`,
      { method: 'PATCH' }
    )
  }

  async cancelOrder(
    establishmentCode: string,
    orderCode: string,
    reason?: string
  ) {
    return this.request<any>(
      `/establishments/${establishmentCode}/orders/${orderCode}/cancelled`,
      {
        method: 'PATCH',
        body: JSON.stringify({ cancellation_reason: reason }),
      }
    )
  }

  // Working Hours
  async getWorkingHours(establishmentCode: string) {
    return this.request<
      Array<{
        id: number
        week_day: string
        opening_hour: string | null
        closing_hour: string | null
        open: boolean
      }>
    >(`/establishments/${establishmentCode}/working_hours`)
  }

  async updateWorkingHour(
    establishmentCode: string,
    workingHourId: number,
    workingHourData: {
      opening_hour?: string
      closing_hour?: string
      open: boolean
    }
  ) {
    return this.request<{
      working_hour: {
        id: number
        week_day: string
        opening_hour: string | null
        closing_hour: string | null
        open: boolean
      }
      message: string
    }>(`/establishments/${establishmentCode}/working_hours/${workingHourId}`, {
      method: 'PATCH',
      body: JSON.stringify({ working_hour: workingHourData }),
    })
  }

  // Public menu endpoint (no authentication required)
  async getPublicMenu(establishmentCode: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/establishments/${establishmentCode}/menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  // Create public order (no authentication required)
  async createPublicOrder(establishmentCode: string, orderData: {
    customer_name?: string
    customer_email?: string
    customer_phone?: string
    customer_cpf?: string
    items: Array<{
      menu_item_id: number
      portion_id: number
      quantity: number
    }>
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/establishments/${establishmentCode}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ order: orderData }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || 'Erro ao criar pedido',
          message: data.message,
        }
      }

      return { data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }
}

export const api = new ApiService()

