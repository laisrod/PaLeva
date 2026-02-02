/**
 * Serviço WebSocket para conexão com Action Cable (Rails)
 * Gerencia conexão, subscrições e callbacks
 */

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

  /**
   * Obtém o token de autenticação do localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  /**
   * Constrói a URL do WebSocket
   */
  private getWebSocketUrl(): string {
    const token = this.getAuthToken()
    if (!token) {
      throw new Error('No auth token available for WebSocket connection')
    }

    // Em desenvolvimento, usar proxy do Vite
    if (import.meta.env.DEV) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      return `${protocol}//${window.location.host}/cable?email=${encodeURIComponent(token)}`
    }
    
    // Em produção, usar URL configurada
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = import.meta.env.VITE_WS_URL || window.location.host
    return `${protocol}//${host}/cable?email=${encodeURIComponent(token)}`
  }

  /**
   * Conecta ao WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return
    }

    this.isConnecting = true
    const token = this.getAuthToken()
    
    if (!token) {
      console.warn('[WebSocket] No auth token found, cannot connect')
      this.isConnecting = false
      return
    }

    const url = this.getWebSocketUrl()
    console.log('[WebSocket] Connecting to:', url)

    try {
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected')
        this.isConnecting = false
        this.reconnectAttempts = 0

        // Reconectar todas as subscrições
        this.resubscribeAll()

        if (this.connectionCallbacks.onOpen) {
          this.connectionCallbacks.onOpen()
        }
      }

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error)
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

  /**
   * Desconecta do WebSocket
   */
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

  /**
   * Agenda uma tentativa de reconexão
   */
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

  /**
   * Envia uma mensagem através do WebSocket
   */
  private send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.warn('[WebSocket] Cannot send message, connection not open')
    }
  }

  /**
   * Processa mensagens recebidas do servidor
   */
  private handleMessage(message: any): void {
    // Mensagem de boas-vindas
    if (message.type === 'welcome') {
      console.log('[WebSocket] Connected and authenticated')
      return
    }

    // Confirmação de subscrição
    if (message.type === 'confirm_subscription') {
      console.log('[WebSocket] Subscription confirmed:', message.identifier)
      const identifier = JSON.parse(message.identifier)
      const subscriptionKey = `${identifier.channel}_${JSON.stringify(identifier)}`
      const subscription = this.subscriptions.get(subscriptionKey)
      if (subscription?.callbacks.connected) {
        subscription.callbacks.connected()
      }
      return
    }

    // Rejeição de subscrição
    if (message.type === 'reject_subscription') {
      console.error('[WebSocket] Subscription rejected:', message.identifier)
      return
    }

    // Mensagem de dados
    if (message.identifier && message.message) {
      try {
        const identifier = JSON.parse(message.identifier)
        const channel = identifier.channel || identifier
        const params = { ...identifier }
        delete params.channel
        const subscriptionKey = `${channel}_${JSON.stringify(params)}`
        const subscription = this.subscriptions.get(subscriptionKey)

        if (subscription?.callbacks.received) {
          subscription.callbacks.received(message.message)
        } else {
          // Tentar buscar por qualquer subscription do canal
          for (const [key, sub] of this.subscriptions.entries()) {
            if (sub.channel === channel) {
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
    
    // Se já existe subscrição, apenas atualizar callbacks
    if (this.subscriptions.has(subscriptionKey)) {
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

    // Se já estiver conectado, enviar comando de subscrição
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendSubscribeCommand(channel, params)
    } else {
      // Conectar primeiro
      this.connect()
    }

    // Retornar função de unsubscribe
    return () => this.unsubscribe(channel, params)
  }

  /**
   * Remove subscrição de um canal
   */
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

  /**
   * Envia comando de subscrição
   */
  private sendSubscribeCommand(channel: string, params: Record<string, any>): void {
    this.send({
      command: 'subscribe',
      identifier: JSON.stringify({
        channel,
        ...params
      })
    })
  }

  /**
   * Reconecta todas as subscrições após reconexão
   */
  private resubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      this.sendSubscribeCommand(subscription.channel, subscription.params || {})
    })
  }

  /**
   * Define callbacks de conexão
   */
  onConnection(callbacks: {
    onOpen?: ConnectionCallback
    onClose?: ConnectionCallback
    onError?: ErrorCallback
  }): void {
    this.connectionCallbacks = callbacks
  }

  /**
   * Verifica se está conectado
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const websocketService = new WebSocketService()
