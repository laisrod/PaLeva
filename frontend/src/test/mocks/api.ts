import { vi } from 'vitest'

/**
 * Mocks para API calls
 * Use estes mocks nos testes para evitar chamadas reais à API
 */

export const mockApiResponse = <T>(data: T, delay = 0) => {
  return new Promise<{ data: T }>((resolve) => {
    setTimeout(() => {
      resolve({ data })
    }, delay)
  })
}

export const mockApiError = (message: string, delay = 0) => {
  return new Promise<{ error: string }>((resolve) => {
    setTimeout(() => {
      resolve({ error: message })
    }, delay)
  })
}

/**
 * Mock do localStorage
 */
export const createMockLocalStorage = () => {
  const store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((key) => delete store[key])
    }),
  }
}

/**
 * Mock de usuário autenticado
 */
export const mockAuthenticatedUser = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  role: 'owner',
  establishment: {
    id: 1,
    code: 'test-code',
    name: 'Test Establishment',
  },
}

/**
 * Mock de token de autenticação
 */
export const mockAuthToken = 'mock-jwt-token'
