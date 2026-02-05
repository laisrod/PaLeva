const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

interface ApiResponse<T> {
  data?: T
  error?: string | string[]
  errors?: string[]
  message?: string
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  private async request<T>(
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

  // Autenticação
  async signIn(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>(
      '/sign_in',
      {
        method: 'POST',
        body: JSON.stringify({ user: { email, password } }),
      }
    )

    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token)
    }

    // Se houver erro e não houver data, garantir que o erro seja retornado
    if (!response.data && !response.error) {
      return {
        ...response,
        error: 'Email ou senha inválidos'
      }
    }

    return response
  }

  async signOut() {
    const response = await this.request('/sign_out', {
      method: 'DELETE',
    })

    localStorage.removeItem('auth_token')
    return response
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
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ user: userData }),
      })

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
        return {
          error: Array.isArray(data.error) ? data.error.join(', ') : (data.error || 'Erro ao criar conta'),
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

  async isSignedIn() {
    return this.request<{ signed_in: boolean; user?: { id: number; email: string; name: string; role: boolean; establishment?: { id: number; code: string; name: string } } }>('/is_signed_in')
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

    const token = this.getAuthToken()
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

    const token = this.getAuthToken()
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

  // Create public order (authentication optional but recommended)
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
      const token = this.getAuthToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      // Adiciona token se disponível (para associar pedido ao usuário)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_BASE_URL}/establishments/${establishmentCode}/orders`, {
        method: 'POST',
        headers,
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

  // Histórico de pedidos do cliente
  async getOrderHistory(params?: {
    status?: string
    start_date?: string
    end_date?: string
    page?: number
    per_page?: number
  }) {
    try {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append('status', params.status)
      if (params?.start_date) queryParams.append('start_date', params.start_date)
      if (params?.end_date) queryParams.append('end_date', params.end_date)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString())

      const queryString = queryParams.toString()
      const endpoint = `/orders/history${queryString ? `?${queryString}` : ''}`

      return await this.request<{
        orders: Array<{
          id: number
          code: string
          status: string
          total_price: number
          created_at: string
          updated_at: string
          establishment: {
            id: number
            code: string
            name: string
          }
          order_menu_items?: Array<{
            id: number
            quantity: number
            menu?: {
              id: number
              name: string
              price: number
            }
            menu_item?: {
              id: number
              name: string
            }
            portion?: {
              id: number
              description: string
              price: number
            }
          }>
        }>
        pagination: {
          page: number
          per_page: number
          total: number
          total_pages: number
        }
      }>(endpoint)
    } catch (error) {
      return {
        error: 'Erro ao buscar histórico de pedidos',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  async getOrderHistoryItem(orderId: number) {
    try {
      return await this.request<{
        order: {
          id: number
          code: string
          status: string
          total_price: number
          created_at: string
          updated_at: string
          establishment: {
            id: number
            code: string
            name: string
          }
          order_menu_items: Array<{
            id: number
            quantity: number
            menu?: {
              id: number
              name: string
              price: number
            }
            menu_item?: {
              id: number
              name: string
            }
            portion?: {
              id: number
              description: string
              price: number
            }
          }>
        }
      }>(`/orders/history/${orderId}`)
    } catch (error) {
      return {
        error: 'Erro ao buscar pedido',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  // Reviews (Avaliações de Pedidos)
  async createOrderReview(orderId: number, reviewData: {
    rating: number
    comment?: string
  }) {
    try {
      return await this.request<{
        review: {
          id: number
          rating: number
          comment?: string
          created_at: string
          user: {
            id: number
            name: string
            email: string
          }
        }
        message: string
      }>(`/orders/${orderId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ review: reviewData }),
      })
    } catch (error) {
      return {
        error: 'Erro ao criar avaliação',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  async getOrderReviews(orderId: number) {
    try {
      return await this.request<{
        reviews: Array<{
          id: number
          rating: number
          comment?: string
          created_at: string
          user: {
            id: number
            name: string
            email: string
          }
        }>
        average_rating: number
        total_reviews: number
      }>(`/orders/${orderId}/reviews`)
    } catch (error) {
      return {
        error: 'Erro ao buscar avaliações',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  // Ratings (Avaliações de Pratos/Bebidas)
  async createDishRating(establishmentCode: string, dishId: number, ratingData: {
    rating: number
    comment?: string
  }) {
    try {
      return await this.request<{
        rating: {
          id: number
          rating: number
          comment?: string
          created_at: string
          user: {
            id: number
            name: string
            email: string
          }
        }
        message: string
      }>(`/establishments/${establishmentCode}/dishes/${dishId}/ratings`, {
        method: 'POST',
        body: JSON.stringify({ rating: ratingData }),
      })
    } catch (error) {
      return {
        error: 'Erro ao criar avaliação',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  async createDrinkRating(establishmentCode: string, drinkId: number, ratingData: {
    rating: number
    comment?: string
  }) {
    try {
      return await this.request<{
        rating: {
          id: number
          rating: number
          comment?: string
          created_at: string
          user: {
            id: number
            name: string
            email: string
          }
        }
        message: string
      }>(`/establishments/${establishmentCode}/drinks/${drinkId}/ratings`, {
        method: 'POST',
        body: JSON.stringify({ rating: ratingData }),
      })
    } catch (error) {
      return {
        error: 'Erro ao criar avaliação',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  async getDishRatings(establishmentCode: string, dishId: number) {
    try {
      return await this.request<{
        ratings: Array<{
          id: number
          rating: number
          comment?: string
          created_at: string
          user: {
            id: number
            name: string
            email: string
          }
        }>
        average_rating: number
        total_ratings: number
      }>(`/establishments/${establishmentCode}/dishes/${dishId}/ratings`)
    } catch (error) {
      return {
        error: 'Erro ao buscar avaliações',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  async getDrinkRatings(establishmentCode: string, drinkId: number) {
    try {
      return await this.request<{
        ratings: Array<{
          id: number
          rating: number
          comment?: string
          created_at: string
          user: {
            id: number
            name: string
            email: string
          }
        }>
        average_rating: number
        total_ratings: number
      }>(`/establishments/${establishmentCode}/drinks/${drinkId}/ratings`)
    } catch (error) {
      return {
        error: 'Erro ao buscar avaliações',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }
}

export const api = new ApiService()

