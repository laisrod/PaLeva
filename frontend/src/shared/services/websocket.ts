type MessageCallback = (data: any) => void
type ConnectionCallback = () => void
type ErrorCallback = (error: Event) => void

interface Subscription {
  channel: string
  params?: Record<string, any>
  callbacks: {
    received?: MessageCallback
    connected?: ConnectionCallback
    disconnected?: ConnectionCallback
  }
}

class WebSocketService {
  private ws: WebSocket | null = null
  private subscriptions: Map<string, Subscription> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private reconnectTimer: number | null = null
  private isConnecting = false
  private connectionCallbacks: {
    onOpen?: ConnectionCallback
    onClose?: ConnectionCallback
    onError?: ErrorCallback
  } = {}

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  private getUserEmail(): string | null {
    // Tentar obter email do localStorage
    // O email pode estar armazenado de diferentes formas
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.email) {
          return user.email
        }
      } catch {
        // Se não conseguir parsear, continuar
      }
    }
    
    // Tentar obter do token (que pode ser o email em alguns casos)
    const token = this.getAuthToken()
    if (token && token.includes('@')) {
      // Se o token parece ser um email, usar
      return token
    }
    
    // Se não encontrar, retornar null
    return null
  }

  private getWebSocketUrl(): string {
    const email = this.getUserEmail()
    if (!email) {
      throw new Error('No user email available for WebSocket connection')
    }

    // Em desenvolvimento, usar proxy do Vite
    if (import.meta.env.DEV) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      return `${protocol}//${window.location.host}/cable?email=${encodeURIComponent(email)}`
    }
    
    // Em produção, usar URL configurada via variável de ambiente ou inferir do API_URL
    const wsUrl = import.meta.env.VITE_WS_URL
    if (wsUrl) {
      // Se VITE_WS_URL estiver configurada, usar diretamente
      const protocol = wsUrl.startsWith('wss://') ? 'wss:' : wsUrl.startsWith('ws://') ? 'ws:' : (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
      const host = wsUrl.replace(/^wss?:\/\//, '').replace(/\/cable.*$/, '')
      return `${protocol}//${host}/cable?email=${encodeURIComponent(email)}`
    }
    
    // Se não houver VITE_WS_URL, tentar inferir do VITE_API_URL
    const apiUrl = import.meta.env.VITE_API_URL
    if (apiUrl && !apiUrl.startsWith('/')) {
      // Se VITE_API_URL for uma URL completa, extrair o host
      try {
        const url = new URL(apiUrl)
        const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
        return `${protocol}//${url.host}/cable?email=${encodeURIComponent(email)}`
      } catch {
        // Se não for uma URL válida, usar o host atual
      }
    }
    
    // Fallback: usar o host atual
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}/cable?email=${encodeURIComponent(email)}`
  }


  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return
    }

    this.isConnecting = true
    const email = this.getUserEmail()
    
    if (!email) {
      console.warn('[WebSocket] No user email found, cannot connect')
      this.isConnecting = false
      return
    }

    const url = this.getWebSocketUrl()
    console.log('[WebSocket] Connecting to:', url, 'with email:', email)

    try {
      this.ws = new WebSocket(url)

            this.ws.onopen = () => {
              console.log('[WebSocket] ✅ Connected successfully')
              this.isConnecting = false
              this.reconnectAttempts = 0

              // Aguardar um pouco antes de resubscribir (ActionCable precisa de tempo para processar welcome)
              setTimeout(() => {
                console.log('[WebSocket] 🔄 Resubscribing to all channels...')
                this.resubscribeAll()
              }, 100)

              if (this.connectionCallbacks.onOpen) {
                this.connectionCallbacks.onOpen()
              }
            }

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          // Ignorar pings completamente (não logar nem processar)
          if (message.type === 'ping') {
            return
          }
          
          // Log todas as outras mensagens para debug
          console.log('[WebSocket] Raw message received:', message)
          // Log detalhado para debug de notificações
          if (!message.identifier && (message.type || message.title)) {
            console.log('[WebSocket] 🔍 Potential notification message:', JSON.stringify(message, null, 2))
          }
          this.handleMessage(message)
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error, 'Raw data:', event.data)
        }
      }

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error)
        this.isConnecting = false
        
        if (this.connectionCallbacks.onError) {
          this.connectionCallbacks.onError(error)
        }
      }

      this.ws.onclose = () => {
        console.log('[WebSocket] Disconnected')
        this.isConnecting = false
        this.ws = null

        if (this.connectionCallbacks.onClose) {
          this.connectionCallbacks.onClose()
        }

        // Tentar reconectar se não foi um fechamento intencional
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect()
        }
      }
    } catch (error) {
      console.error('[WebSocket] Connection error:', error)
      this.isConnecting = false
    }
  }


  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.subscriptions.clear()
  }


  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * this.reconnectAttempts

    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, delay)
  }


  private send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.warn('[WebSocket] Cannot send message, connection not open')
    }
  }


  private handleMessage(message: any): void {
    // Ignorar mensagens de ping (heartbeat)
    if (message.type === 'ping') {
      return
    }
    
    console.log('[WebSocket] Received message:', message)
    
    // Mensagem de boas-vindas
    if (message.type === 'welcome') {
      console.log('[WebSocket]  Connected and authenticated')
      return
    }

    if (message.type === 'confirm_subscription') {
      console.log('[WebSocket]  Subscription confirmed:', message.identifier)
      const identifier = JSON.parse(message.identifier)
      const subscriptionKey = `${identifier.channel}_${JSON.stringify(identifier)}`
      const subscription = this.subscriptions.get(subscriptionKey)
      if (subscription?.callbacks.connected) {
        subscription.callbacks.connected()
      }
      return
    }

    if (message.type === 'reject_subscription') {
      console.error('[WebSocket]  Subscription rejected:', message.identifier)
      return
    }

    // ActionCable envia mensagens de broadcast diretamente (sem identifier)
    // Verificar se é uma mensagem de broadcast direto (notificação)
    // O ActionCable pode enviar como objeto direto ou dentro de uma propriedade message
    // Primeiro, verificar se é uma mensagem de broadcast direto (sem identifier)
    if (!message.identifier) {
      // Pode ser uma notificação direta
      // Verificar diferentes formatos possíveis do ActionCable
      let notificationData = null
      
      // Formato 1: Objeto direto com type e title (formato mais comum do ActionCable)
      if (message.type && message.title) {
        notificationData = message
        console.log('[WebSocket] 📨 Detected notification format 1 (direct object):', notificationData)
      }
      // Formato 2: Dentro de message.message
      else if (message.message && typeof message.message === 'object' && message.message.type && message.message.title) {
        notificationData = message.message
        console.log('[WebSocket] 📨 Detected notification format 2 (nested in message.message):', notificationData)
      }
      // Formato 3: Objeto direto sem message wrapper mas com title
      else if (message.title) {
        notificationData = message
        console.log('[WebSocket] 📨 Detected notification format 3 (has title):', notificationData)
      }
      
      if (notificationData) {
        // É uma notificação direta do ActionCable (broadcast)
        console.log('[WebSocket] 📨 ✅ Confirmed notification broadcast:', notificationData)
        console.log('[WebSocket] 🔍 Current subscriptions:', Array.from(this.subscriptions.keys()))
        
        // Buscar subscription do NotificationsChannel
        let found = false
        for (const [key, sub] of this.subscriptions.entries()) {
          if (sub.channel === 'NotificationsChannel') {
            console.log('[WebSocket] ✅ Found NotificationsChannel subscription, key:', key)
            console.log('[WebSocket] 📤 Calling received callback with:', notificationData)
            if (sub.callbacks.received) {
              try {
                sub.callbacks.received(notificationData)
                found = true
                console.log('[WebSocket] ✅ Successfully called received callback')
              } catch (error) {
                console.error('[WebSocket] ❌ Error calling received callback:', error)
              }
            } else {
              console.warn('[WebSocket] ⚠️ Subscription found but no received callback!')
            }
            break
          }
        }
        
        if (!found) {
          console.warn('[WebSocket] ⚠️ Notification received but no NotificationsChannel subscription found!')
          console.warn('[WebSocket] ⚠️ Active subscriptions:', Array.from(this.subscriptions.keys()))
        }
        return
      }
      
      // Se não for notificação, pode ser outro tipo de broadcast - logar para debug
      if (message.type && message.type !== 'ping' && message.type !== 'welcome') {
        console.log('[WebSocket] 📬 Received broadcast message (not notification):', message)
      }
    }

    if (message.identifier && message.message) {
      try {
        const identifier = JSON.parse(message.identifier)
        const channel = identifier.channel || identifier
        const params = { ...identifier }
        delete params.channel
        const subscriptionKey = `${channel}_${JSON.stringify(params)}`
        const subscription = this.subscriptions.get(subscriptionKey)

        console.log('[WebSocket] Processing message for channel:', channel, 'subscriptionKey:', subscriptionKey)

        if (subscription?.callbacks.received) {
          console.log('[WebSocket] Found subscription, calling received callback')
          subscription.callbacks.received(message.message)
        } else {
          // Tentar buscar por qualquer subscription do canal
          console.log('[WebSocket] Subscription not found by key, searching by channel...')
          for (const [key, sub] of this.subscriptions.entries()) {
            if (sub.channel === channel) {
              console.log('[WebSocket] Found subscription by channel, calling received callback')
              sub.callbacks.received?.(message.message)
              break
            }
          }
        }
      } catch (error) {
        console.error('[WebSocket] Error parsing message identifier:', error)
      }
    }
  }

  /**
   * Subscreve a um canal
   */
  subscribe(
    channel: string,
    params: Record<string, any> = {},
    callbacks: {
      received?: MessageCallback
      connected?: ConnectionCallback
      disconnected?: ConnectionCallback
    } = {}
  ): () => void {
    const subscriptionKey = `${channel}_${JSON.stringify(params)}`
    
    console.log('[WebSocket] 📝 Subscribe called for channel:', channel, 'params:', params, 'key:', subscriptionKey)
    
    // Se já existe subscrição, apenas atualizar callbacks
    if (this.subscriptions.has(subscriptionKey)) {
      console.log('[WebSocket] ⚠️ Subscription already exists, updating callbacks')
      const existing = this.subscriptions.get(subscriptionKey)!
      existing.callbacks = { ...existing.callbacks, ...callbacks }
      return () => this.unsubscribe(channel, params)
    }

    const subscription: Subscription = {
      channel,
      params,
      callbacks
    }

    this.subscriptions.set(subscriptionKey, subscription)
    console.log('[WebSocket] ✅ Subscription added. Total subscriptions:', this.subscriptions.size)

    // Se já estiver conectado, enviar comando de subscrição
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] WebSocket is open, sending subscribe command')
      this.sendSubscribeCommand(channel, params)
    } else {
      // Conectar primeiro
      console.log('[WebSocket] WebSocket not open, connecting first...')
      this.connect()
    }

    // Retornar função de unsubscribe
    return () => this.unsubscribe(channel, params)
  }


  unsubscribe(channel: string, params: Record<string, any> = {}): void {
    const subscriptionKey = `${channel}_${JSON.stringify(params)}`
    const subscription = this.subscriptions.get(subscriptionKey)

    if (subscription && this.ws?.readyState === WebSocket.OPEN) {
      this.send({
        command: 'unsubscribe',
        identifier: JSON.stringify({
          channel,
          ...params
        })
      })
    }

    this.subscriptions.delete(subscriptionKey)
  }

  private sendSubscribeCommand(channel: string, params: Record<string, any>): void {
    const identifier = {
      channel,
      ...params
    }
    console.log('[WebSocket] 📤 Subscribing to channel:', channel, 'with params:', params)
    this.send({
      command: 'subscribe',
      identifier: JSON.stringify(identifier)
    })
  }


  private resubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      this.sendSubscribeCommand(subscription.channel, subscription.params || {})
    })
  }


  onConnection(callbacks: {
    onOpen?: ConnectionCallback
    onClose?: ConnectionCallback
    onError?: ErrorCallback
  }): void {
    this.connectionCallbacks = callbacks
  }


  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const websocketService = new WebSocketService()
